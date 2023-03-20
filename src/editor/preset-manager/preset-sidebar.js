/**
 * External dependencies
 */
import { isEmpty } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	Button,
	Modal,
	MenuGroup,
	MenuItem,
	SearchControl,
	Spinner,
	Tooltip,
} from '@wordpress/components';
import { Icon, plus } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import { visibilityHiddenAlt } from './../../utils/icons';

/**
 * Render the sidebar in the presets modal.
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 */
export default function PresetSidebar( props ) {
	const {
		presetAttributes,
		setPresetAttributes,
		presets,
		addNewPreset,
		hasUpdates,
		setHasUpdates,
	} = props;
	const [ searchInput, setSearchInput ] = useState( '' );
	const [ confirmModalAtts, setConfirmModalAtts ] = useState( {
		open: false,
	} );

	const isFetching = presets === 'fetching';
	let shownPresets = presets;

	// Filter by search input.
	if ( ! isFetching && searchInput && searchInput.length > 1 ) {
		shownPresets = presets.filter( ( preset ) => {
			const input = searchInput.toLowerCase();
			let presetTitle = preset?.title?.raw ?? '';
			presetTitle = !! presetTitle && presetTitle.toLowerCase();

			// Check if the name matches.
			if ( presetTitle.includes( input ) ) {
				return true;
			}

			return false;
		} );
	}

	function editPreset( id ) {
		const presetToEdit = presets.filter( ( p ) => p.id === id );

		if ( ! isEmpty( presetToEdit ) ) {
			const preset = presetToEdit[ 0 ];

			setPresetAttributes( {
				id: preset.id,
				title: preset.title.raw,
				date: preset?.date,
				modified: preset?.modified,
				enable: preset?.meta?.enable ?? true,
				layout: preset?.meta?.layout ?? 'columns',
				hideBlock: preset?.meta?.hide_block ?? false,
				controlSets: preset?.meta?.control_sets ?? [],
			} );

			// Need this if switching from brand new preset to saved preset.
			setHasUpdates( false );
		}
	}

	function triggerAction( type, id = null ) {
		if ( hasUpdates ) {
			setConfirmModalAtts( { open: true, type, id } );
		} else if ( type === 'edit' ) {
			editPreset( id );
		} else {
			addNewPreset();
		}
	}

	const confirmModal = (
		<Modal
			className="block-visibility__confirmation-modal"
			title={ __( 'Unsaved changes', 'block-visibility' ) }
			onRequestClose={ () => setConfirmModalAtts( { open: false } ) }
			shouldCloseOnClickOutside={ false }
		>
			<p>
				{ __(
					'The current preset has unsaved changes. Would you like to continue? This action cannot be undone.',
					'block-visibility'
				) }
			</p>
			<div className="block-visibility__confirmation-modal--buttons">
				<Button
					isSecondary
					onClick={ () => setConfirmModalAtts( { open: false } ) }
				>
					{ __( 'Cancel', 'block-visibility' ) }
				</Button>
				<Button
					isPrimary
					onClick={ () => {
						if ( confirmModalAtts?.type === 'edit' ) {
							editPreset( confirmModalAtts?.id );
						} else {
							addNewPreset();
						}
						setConfirmModalAtts( { open: false } );
					} }
				>
					{ __( 'Confirm', 'block-visibility' ) }
				</Button>
			</div>
		</Modal>
	);

	return (
		<div className="preset-manager__sidebar">
			<SearchControl
				className={ classnames( {
					'is-disabled': isEmpty( presets ) || isFetching,
				} ) }
				value={ searchInput }
				onChange={ setSearchInput }
				disabled={ isEmpty( presets ) || isFetching }
			/>
			<div className="sidebar__presets-title">
				<span>{ __( 'Presets', 'block-visibility' ) }</span>
				<Button
					label={ __( 'Add new preset', 'block-visibility' ) }
					icon={ plus }
					onClick={ () => triggerAction( 'add' ) }
				/>
			</div>
			{ isFetching && <Spinner /> }
			{ ! isFetching && isEmpty( shownPresets ) && searchInput && (
				<div className="sidebar__presets-no-results">
					<Icon icon={ visibilityHiddenAlt } />
					<p>{ __( 'No presets found.', 'block-visibility' ) }</p>
				</div>
			) }
			{ ! isFetching && isEmpty( shownPresets ) && ! searchInput && (
				<div className="sidebar__presets-placeholder">
					<span></span>
					<span></span>
					<span></span>
					<span></span>
				</div>
			) }
			{ ! isFetching && ! isEmpty( shownPresets ) && (
				<MenuGroup className="sidebar__presets-list">
					{ shownPresets.map( ( preset ) => {
						const title = preset?.title?.raw
							? preset?.title?.raw
							: __( '(no title)', 'block-visibility' );
						const isActive = presetAttributes?.id === preset.id;
						const enabled = preset?.meta?.enable;

						return (
							<>
								<MenuItem
									key={ `category-${ preset.id }` }
									className={ classnames( {
										'is-active': isActive,
									} ) }
									isPressed={ isActive }
									onClick={ () =>
										triggerAction( 'edit', preset.id )
									}
								>
									{
										<>
											<span className="title">
												{ title }
											</span>
											{ ! enabled && (
												<Tooltip
													text={ __(
														'Disabled',
														'block-visibility'
													) }
												>
													<span className="is-disabled">
														<svg
															viewBox="0 0 24 24"
															xmlns="http://www.w3.org/2000/svg"
														>
															<circle
																cx="12"
																cy="12"
																r="12"
															></circle>
														</svg>
													</span>
												</Tooltip>
											) }
										</>
									}
								</MenuItem>
							</>
						);
					} ) }
				</MenuGroup>
			) }
			{ confirmModalAtts?.open && confirmModal }
		</div>
	);
}
