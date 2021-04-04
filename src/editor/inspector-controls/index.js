/**
 * External dependencies
 */
import { assign, isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelBody, withFilters, Slot } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import HideBlock from './hide-block';
import ControlSet from './control-set';
import { NoticeControlsDisabled } from './utils/notices-tips';
import hasVisibilityControls from './../utils/has-visibility-controls';
import hasPermission from './../utils/has-permission';
import usePluginData from './../utils/use-plugin-data';
import getEnabledControls from './../../utils/get-enabled-controls';

/**
 * Add the Visibility inspector control to each allowed block in the editor
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function VisibilityInspectorControls( props ) {
	const { attributes, name } = props;
	const blockVisibility = attributes?.blockVisibility;
	const [ blockAtts, setBlockAtts ] = useState( blockVisibility );
	const settings = usePluginData( 'settings' );
	const variables = usePluginData( 'variables' );

	const enabledControls = getEnabledControls( settings, variables );
	const defaultControlSettings = settings?.plugin_settings?.default_controls ?? {};
	let defaultControls = {};

	if ( ! isEmpty( defaultControlSettings ) ) {
		enabledControls.forEach( ( control ) => {
			if ( defaultControlSettings.includes( control.settingSlug ) ) {
				defaultControls[ control.attributeSlug ] = {};
			}
		} );
	} else {
		defaultControls = {
			dateTime: {},
			userRole: {},
			screenSize: {},
		}
	};

	useEffect( () => {
		let controlSets = blockAtts?.controlSets ?? [];

		// Create the default control set and populate with any previous attributes.
		if ( controlSets.length === 0 ) {
			const defaultSet = [
				{
					id: 0,
					name: __( 'Control Set', 'block-visibility' ),
					enable: true,
					controls: defaultControls,
				},
			];
			controlSets = getDeprecatedAtts( blockAtts, defaultSet );

			setBlockAtts( assign( { ...blockAtts }, { controlSets } ) );
		}
	}, [] );

	if ( settings === 'fetching' || variables === 'fetching' || ! blockAtts ) {
		return null;
	}

	if ( ! hasPermission( settings, variables ) ) {
		return null;
	}

	const hasVisibility = hasVisibilityControls( settings, name );

	if ( ! hasVisibility ) {
		return null;
	}

	const settingsUrl = variables?.plugin_variables.settings_url ?? ''; // eslint-disable-line

	// Provides an entry point to slot in additional settings.
	const AdditionalInspectorControls = withFilters(
		'blockVisibility.addInspectorControls'
	)( ( props ) => <></> ); // eslint-disable-line

	// Need to reset due to error when switching from code editor to visual editor.
	const controlSets = blockAtts?.controlSets ?? [];

	const hideBlock = blockVisibility?.hideBlock ?? false;
	const hasHideBlock = enabledControls.some( ( control ) =>
		control.settingSlug === 'hide_block'
	);
	const blockHidden = hasHideBlock && hideBlock;

	return (
		// Note that the core InspectorControls component is already making use
		// of SlotFill, and is "inside" of a <SlotFillProvider> component.
		// Therefore we can freely use SlofFill without needing to add the
		// provider ourselves.
		<InspectorControls>
			<PanelBody
				title={ __( 'Visibility', 'block-visibility' ) }
				className="block-visibility"
				initialOpen={ false }
			>
				<div className="visibility-controls__container">
					{ enabledControls.length !== 0 && (
						<>
							<Slot name="InspectorControlsTop" />
							<HideBlock
								enabledControls={ enabledControls }
								blockAtts={ blockAtts }
								setBlockAtts={ setBlockAtts }
								{ ...props }
							/>
							<Slot name="InspectorControlsMiddle" />
							{ ! blockHidden &&
								controlSets.map( ( controlSet ) => {
									return (
										<ControlSet
											key={ controlSet.id }
											settings={ settings }
											variables={ variables }
											defaultControls={ defaultControls }
											enabledControls={ enabledControls }
											controlSetAtts={ controlSet }
											blockAtts={ blockAtts }
											{ ...props }
										/>
									);
								} ) }
							<Slot name="InspectorControlsBottom" />
						</>
					) }
					{ enabledControls.length === 0 && (
						<NoticeControlsDisabled settingsUrl={ settingsUrl } />
					) }
				</div>
			</PanelBody>
			<AdditionalInspectorControls
				settings={ settings }
				variables={ variables }
				enabledControls={ enabledControls }
				{ ...props }
			/>
		</InspectorControls>
	);
}

/**
 * Converts visibility attributes pre v1.6 to a control set. Also handles some
 * deprecation logic from previous versions.
 *
 * @since 1.6.0
 * @param {Object} blockAtts   All the current attributes
 * @param {Object} controlSets The new control set
 * @return {Object}		       Return the updated control set with the old attributes applied
 */
function getDeprecatedAtts( blockAtts, controlSets ) {
	if (
		blockAtts?.scheduling ||
		blockAtts?.startDateTime ||
		blockAtts?.endDateTime
	) {
		controlSets[ 0 ].controls.dateTime.schedules = [ { id: 0 } ];
	}

	if ( blockAtts?.startDateTime ) {
		controlSets[ 0 ].controls.dateTime.schedules[ 0 ].start =
			blockAtts.startDateTime;
	}

	if ( blockAtts?.endDateTime ) {
		controlSets[ 0 ].controls.dateTime.schedules[ 0 ].end =
			blockAtts.endDateTime;
	}

	if ( blockAtts?.scheduling ) {
		if ( blockAtts?.scheduling?.enable ) {
			controlSets[ 0 ].controls.dateTime.schedules[ 0 ].enable =
				blockAtts.scheduling.enable;
		}

		if ( blockAtts?.scheduling?.start ) {
			controlSets[ 0 ].controls.dateTime.schedules[ 0 ].start =
				blockAtts.scheduling.start;
		}

		if ( blockAtts?.scheduling?.end ) {
			controlSets[ 0 ].controls.dateTime.schedules[ 0 ].end =
				blockAtts.scheduling.end;
		}
	}

	if ( blockAtts?.hideOnScreenSize ) {
		controlSets[ 0 ].controls.screenSize.hideOnScreenSize =
			blockAtts.hideOnScreenSize;
	}

	if ( blockAtts?.visibilityByRole ) {
		if ( blockAtts?.visibilityByRole === 'all' ) {
			controlSets[ 0 ].controls.userRole.visibilityByRole = 'public';
		} else {
			controlSets[ 0 ].controls.userRole.visibilityByRole =
				blockAtts.visibilityByRole;
		}
	}

	if ( blockAtts?.hideOnRestrictedRoles ) {
		controlSets[ 0 ].controls.userRole.hideOnRestrictedRoles =
			blockAtts.hideOnRestrictedRoles;
	}

	if ( blockAtts?.restrictedRoles ) {
		controlSets[ 0 ].controls.userRole.restrictedRoles =
			blockAtts.restrictedRoles;
	}

	return controlSets;
}
