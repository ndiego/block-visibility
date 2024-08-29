/**
 * External dependencies
 */
import { isEqual } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import {
	Button,
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Modal,
	Notice,
	TextControl,
	ToggleControl,
	VisuallyHidden,
} from '@wordpress/components';
import { Icon, moreVertical, plus, external } from '@wordpress/icons';
import { getSettings, format } from '@wordpress/date'; // eslint-disable-line

/**
 * Internal dependencies.
 */
import links from './../../utils/links';
import { rows, columns } from './../../utils/icons';

/**
 * Render the individual preset header in the presets modal.
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 */
export default function PresetHeader( props ) {
	const {
		presetAttributes,
		setPresetAttributes,
		presets,
		controlSets,
		hasUpdates,
		setHasUpdates,
	} = props;
	const {
		deleteEntityRecord,
		editEntityRecord,
		saveEditedEntityRecord,
		saveEntityRecord,
	} = useDispatch( coreStore );

	const [ isDeleteModalOpen, setDeleteModalOpen ] = useState( false );
	const [ status, setStatus ] = useState( 'complete' );

	async function triggerAction( type = 'publish' ) {
		setStatus( 'working' );

		const postType = 'visibility_preset';
		const id = presetAttributes?.id ?? null;

		let title = presetAttributes?.title ?? '';
		title =
			type === 'duplicate'
				? sprintf(
						// translators: %s: Title of preset.
						__( '%s (copy)', 'block-visibility' ),
						title
				  )
				: title;

		const meta = {
			enable: presetAttributes?.enable ?? true,
			layout: presetAttributes?.layout ?? 'columns',
			hide_block: presetAttributes?.hideBlock ?? false,
			control_sets: presetAttributes?.controlSets ?? [],
		};

		const originalPreset = presets.filter( ( preset ) => preset.id === id );
		const originalTitle = originalPreset[ 0 ]?.title?.raw ?? '';
		const originalMeta = {
			enable: originalPreset[ 0 ]?.meta?.enable ?? true,
			layout: originalPreset[ 0 ]?.meta?.layout ?? 'columns',
			hide_block: originalPreset[ 0 ]?.meta?.hide_block ?? false,
			control_sets: originalPreset[ 0 ]?.meta?.control_sets ?? [],
		};

		// If the user preforms a change and then reverts the change and tries
		// to save the preset, the save action will fail. So here we check if
		// anything actually changed and bail if needed.
		if ( isEqual( originalMeta, meta ) && originalTitle === title ) {
			setStatus( 'complete' );
			setHasUpdates( false );
			return;
		}

		const record = { title, status: 'publish', meta };
		let response = '';

		if ( type === 'update' && id ) {
			response = await editEntityRecord(
				'postType',
				postType,
				id,
				record
			);
			response = await saveEditedEntityRecord( 'postType', postType, id );
		} else {
			response = await saveEntityRecord( 'postType', postType, record );
		}

		if ( response ) {
			// Need to update the id and the title since they both can change.
			setPresetAttributes( {
				...presetAttributes,
				id: response.id,
				title: response.title.raw,
				date: response?.date,
				modified: response?.modified,
			} );
			setStatus( 'complete' );
			setHasUpdates( false );
		} else {
			setStatus( 'error' );
		}
	}

	const id = presetAttributes?.id ?? null;
	const title = presetAttributes?.title ?? '';
	const modified = presetAttributes?.modified ?? '';
	const enable = presetAttributes?.enable ?? true;
	const hideBlock = presetAttributes?.hideBlock ?? false;
	const layout = presetAttributes?.layout ?? 'columns';
	const dateSettings = getSettings();

	function deletePreset() {
		deleteEntityRecord( 'postType', 'visibility_preset', id );
		setPresetAttributes( {} );
		setHasUpdates( false );
		setDeleteModalOpen( false );
	}

	function setAttributes( attribute, value ) {
		setPresetAttributes( { ...presetAttributes, [ attribute ]: value } );
		setHasUpdates( true );
	}

	function addControlSet() {
		const maxId = Math.max( ...controlSets.map( ( set ) => set.id ), 0 );
		const setId = maxId + 1;
		const defaultSet = {
			id: setId,
			enable: true,
			controls: {},
		};

		setPresetAttributes( {
			...presetAttributes,
			controlSets: [ ...controlSets, defaultSet ],
		} );
		setHasUpdates( true );
	}

	const deletePresetModal = (
		<Modal
			className="block-visibility__confirmation-modal"
			title={ __( 'Remove preset', 'block-visibility' ) }
			onRequestClose={ () => setDeleteModalOpen( false ) }
			shouldCloseOnClickOutside={ false }
		>
			<p>
				{ __(
					'Any blocks that are currently hidden by this preset will become visible again if no other visibility controls are set. Would you like to continue? This action cannot be undone.',
					'block-visibility'
				) }
			</p>
			<div className="block-visibility__confirmation-modal--buttons">
				<Button
					variant="secondary"
					onClick={ () => setDeleteModalOpen( false ) }
				>
					{ __( 'Cancel', 'block-visibility' ) }
				</Button>
				<Button variant="primary" onClick={ () => deletePreset( id ) }>
					{ __( 'Remove', 'block-visibility' ) }
				</Button>
			</div>
		</Modal>
	);

	const optionsDropdown = (
		<DropdownMenu
			className="options-dropdown"
			label={ __( 'Options', 'block-visibility' ) }
			icon={ moreVertical }
			popoverProps={ { focusOnMount: 'container' } }
		>
			{ ( { onClose } ) => (
				<>
					<MenuGroup label={ __( 'Tools', 'block-visibility' ) }>
						<MenuItem
							onClick={ () => {
								triggerAction( 'duplicate' );
								onClose();
							} }
							disabled={ ! id || hasUpdates }
						>
							{ __( 'Duplicate', 'block-visibility' ) }
						</MenuItem>
						<a
							href={ links.editorVisibilityPresets }
							target="_blank"
							role="menuitem"
							rel="noopener noreferrer"
							className="components-button components-menu-item__button"
						>
							<span className="components-menu-item__item">
								{ __( 'Help', 'block-visibility' ) }
								<VisuallyHidden>
									{ __(
										'(opens in a new tab)',
										'block-visibility'
									) }
								</VisuallyHidden>
							</span>
							<Icon icon={ external } size={ 20 } />
						</a>
					</MenuGroup>
					<MenuGroup>
						<MenuItem
							onClick={ () => {
								setDeleteModalOpen( true );
								onClose();
							} }
						>
							{ __( 'Remove preset', 'block-visibility' ) }
						</MenuItem>
					</MenuGroup>
				</>
			) }
		</DropdownMenu>
	);

	const publishLabel =
		status !== 'working'
			? __( 'Publish', 'block-visibility' )
			: __( 'Publishing', 'block-visibility' );
	const updateLabel =
		status !== 'working'
			? __( 'Update', 'block-visibility' )
			: __( 'Updating', 'block-visibility' );
	const publishUpdateLabel = id ? updateLabel : publishLabel;

	return (
		<div className="preset-manager__preset-header">
			<div className="preset-header__toolbar">
				<div className="toolbar__control-set-tools">
					<Button
						label={ __( 'Add control set', 'block-visibility' ) }
						icon={ plus }
						onClick={ addControlSet }
						variant="primary"
					/>
					<Button
						label={ __( 'Display as rows', 'block-visibility' ) }
						icon={ rows }
						onClick={ () => setAttributes( 'layout', 'rows' ) }
						isPressed={ layout === 'rows' }
					/>
					<Button
						label={ __( 'Display as columns', 'block-visibility' ) }
						icon={ columns }
						onClick={ () => setAttributes( 'layout', 'columns' ) }
						isPressed={ layout === 'columns' }
					/>
				</div>
				<div className="toolbar__publish-tools">
					<Button
						className={ classnames( {
							'is-busy': status === 'working',
						} ) }
						onClick={ () =>
							triggerAction( id ? 'update' : 'publish' )
						}
						disabled={ ! hasUpdates && status !== 'error' }
						variant="primary"
					>
						{ publishUpdateLabel }
					</Button>
					{ optionsDropdown }
					{ isDeleteModalOpen && deletePresetModal }
				</div>
			</div>
			{ status === 'error' && (
				<div className="preset-header__notices">
					<Notice status="error" isDismissible={ false }>
						{ __(
							'Something went wrong. Please try again or contact support.',
							'block-visibility'
						) }
					</Notice>
				</div>
			) }
			<div className="preset-header__settings">
				<div className="preset-title">
					<div className="preset-title__label">
						<span>
							{ __( 'Preset Title', 'block-visibility' ) }
						</span>
					</div>
					<TextControl
						value={ title }
						onChange={ ( value ) =>
							setAttributes( 'title', value )
						}
						placeholder={ __(
							'Add preset title',
							'block-visibility'
						) }
					/>
					<div className="preset-title__meta">
						{ modified && (
							<span>
								{ sprintf(
									// translators: %s: Date/time preset was created.
									__( 'Modified: %s', 'block-visibility' ),
									format(
										`${ dateSettings.formats.date } ${ dateSettings.formats.time }`,
										modified
									)
								) }
							</span>
						) }
						{ id && (
							<span>
								{ sprintf(
									// translators: %s: Id of preset.
									__( 'Id: %s', 'block-visibility' ),
									id
								) }
							</span>
						) }
					</div>
				</div>
				<div className="preset-controls">
					<ToggleControl
						label={ __( 'Enable preset', 'block-visibility' ) }
						checked={ enable }
						onChange={ () => setAttributes( 'enable', ! enable ) }
					/>
					<ToggleControl
						label={ __( 'Hide block', 'block-visibility' ) }
						checked={ hideBlock }
						onChange={ () =>
							setAttributes( 'hideBlock', ! hideBlock )
						}
						help={ __(
							'Hide the block from everyone.',
							'block-visibility'
						) }
					/>
				</div>
			</div>
		</div>
	);
}
