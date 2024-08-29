/**
 * External dependencies
 */
import { assign, isEmpty } from 'lodash';
import Select from 'react-select';

/**
 * WordPress dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';
import { useEntityRecords } from '@wordpress/core-data';
import { useState } from '@wordpress/element';
import {
	Button,
	Modal,
	Notice,
	Spinner,
	ToggleControl,
} from '@wordpress/components';
import { plus, settings as settingsIcon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { InformationPopover } from './../../components';
import PresetManager from './../../editor/preset-manager';
import links from './../../utils/links';

/**
 * Add the Visibility Presets control
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 */
export default function VisibilityPresets( props ) {
	const [ isModalOpen, setModalOpen ] = useState( false );
	const { attributes, setAttributes, enabledControls, settings, variables } =
		props;
	const presetData = useEntityRecords( 'postType', 'visibility_preset', {
		per_page: -1,
	} );

	const presets = [];

	if ( presetData.hasResolved && presetData?.records?.length ) {
		presetData.records.forEach( ( preset ) => {
			const presetLabel = preset?.title?.raw
				? preset.title.raw
				: __( '(no title)', 'block-visibility' );

			const value = {
				value: preset.id,
				label: presetLabel,
			};
			presets.push( value );
		} );
	}

	const controlActive = enabledControls.some(
		( control ) =>
			control.settingSlug === 'visibility_presets' && control?.isActive
	);

	if ( ! controlActive ) {
		return null;
	}

	const enableNotices =
		settings?.plugin_settings?.enable_editor_notices ?? true;
	const { blockVisibility } = attributes;
	const visibilityPresetAtts = blockVisibility?.visibilityPresets ?? {};
	const visibilityPresets = visibilityPresetAtts?.presets ?? [];
	const presetsOperator = visibilityPresetAtts?.operator ?? 'all';
	const hideOnPresets = visibilityPresetAtts?.hideOnPresets ?? false;
	const roles = variables?.current_users_roles ?? [];

	let canEdit = false;

	// While roles should always be an array, double check.
	if ( Array.isArray( roles ) ) {
		const allowedRoles = [ 'super-admin', 'administrator', 'editor' ];
		canEdit = roles.some( ( role ) => allowedRoles.includes( role ) );
	} else {
		// Temporary patch to correct for third-party plugin conflict.
		// @TODO remove once conflict is resolved.
		canEdit = true;
	}

	function handlePresetChange( sets ) {
		const newPresets = [];

		if ( sets.length !== 0 ) {
			sets.forEach( ( set ) => {
				newPresets.push( set.value );
			} );
		}

		setAttributes( {
			blockVisibility: assign(
				{ ...blockVisibility },
				{
					visibilityPresets: assign(
						{ ...visibilityPresetAtts },
						{ presets: newPresets }
					),
				}
			),
		} );
	}

	function handleOperatorChange( value ) {
		const operator = value?.value ?? 'all';

		setAttributes( {
			blockVisibility: assign(
				{ ...blockVisibility },
				{
					visibilityPresets: assign(
						{ ...visibilityPresetAtts },
						{ operator }
					),
				}
			),
		} );
	}

	let selectedPresets = [];
	let placeholder = __( 'Select Preset…', 'block-visibility' );
	let buttonText = '';

	if ( presets === null ) {
		placeholder = __( 'Loading Presets…', 'block-visibility' );
	} else if ( isEmpty( presets ) ) {
		placeholder = __( 'No Presets Found…', 'block-visibility' );
		buttonText = __( 'Add new preset', 'block-visibility' );
	} else {
		selectedPresets = presets.filter( ( set ) =>
			visibilityPresets.includes( set.value )
		);
		buttonText = __( 'Manage presets', 'block-visibility' );
	}

	const operators = [
		{
			value: 'atLeastOne',
			label: __(
				'At least one selected preset applies',
				'block-visibility'
			),
		},
		{
			value: 'all',
			label: __( 'All selected presets apply', 'block-visibility' ),
		},
		{
			value: 'none',
			label: __( 'No selected presets apply', 'block-visibility' ),
		},
	];

	return (
		<>
			<div className="controls-panel-item visibility-presets-control">
				<h3 className="controls-panel-item__header has-icon">
					<span>
						{ __( 'Visibility Presets', 'block-visibility' ) }
					</span>
					{ enableNotices && (
						<InformationPopover
							message={ __(
								'A Visibility Preset is a collection of visibility conditions that can be applied to any number of blocks. This allows you to independently configure and manage the visibility of multiple blocks at once.',
								'block-visibility'
							) }
							link={ links.editor.visibilityPresets }
							position="bottom center"
						/>
					) }
					<div className="controls-panel-item__header-toolbar">
						{ presetData.isResolving && <Spinner /> }
						{ buttonText && canEdit && (
							<Button
								icon={
									isEmpty( presets ) ? plus : settingsIcon
								}
								onClick={ () => setModalOpen( true ) }
								label={ buttonText }
								size="small"
							/>
						) }
					</div>
				</h3>
				<div className="controls-panel-item__control-fields">
					<div className="control-fields-item__label">
						{ sprintf(
							// Translators: Whether the block is hidden or visible.
							__( '%s the block if', 'block-visibility' ),
							hideOnPresets
								? __( 'Hide', 'block-visibility' )
								: __( 'Show', 'block-visibility' )
						) }
					</div>
					<div className="fields-container">
						<Select
							className="block-visibility__react-select"
							classNamePrefix="react-select"
							options={ operators }
							value={ operators.filter(
								( operator ) =>
									operator.value === presetsOperator
							) }
							placeholder={ __(
								'Select Condition…',
								'block-visibility'
							) }
							onChange={ ( value ) =>
								handleOperatorChange( value )
							}
						/>
						<Select
							className="block-visibility__react-select"
							classNamePrefix="react-select"
							options={ isEmpty( presets ) ? null : presets }
							value={ selectedPresets }
							placeholder={ placeholder }
							onChange={ ( value ) =>
								handlePresetChange( value )
							}
							isMulti
							isLoading={ presetData.isResolving }
							isDisabled={
								presets === null || isEmpty( presets )
							}
						/>
					</div>
					{ presets !== null && presets.length === 0 && (
						<Notice status="warning" isDismissible={ false }>
							{ __(
								'Add visibility presets using the plus icon in the toolbar above.',
								'block-visibility'
							) }
						</Notice>
					) }
					<div className="control-fields-item__hide-when">
						<ToggleControl
							label={ __(
								'Hide when presets apply',
								'block-visibility'
							) }
							checked={ hideOnPresets }
							onChange={ () =>
								setAttributes( {
									blockVisibility: assign(
										{ ...blockVisibility },
										{
											visibilityPresets: assign(
												{ ...visibilityPresetAtts },
												{
													hideOnPresets:
														! hideOnPresets,
												}
											),
										}
									),
								} )
							}
						/>
					</div>
				</div>
			</div>
			{ isModalOpen && (
				<Modal
					className="block-visibility__preset-manager-modal"
					title={ __(
						'Block Visibility Presets',
						'block-visibility'
					) }
					onRequestClose={ () => setModalOpen( false ) }
					shouldCloseOnClickOutside={ false }
					isFullScreen
				>
					<PresetManager />
				</Modal>
			) }
		</>
	);
}
