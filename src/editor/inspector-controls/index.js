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
import { withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import HideBlock from './hide-block';
import ControlSet from './control-set';
import {
	NoticeControlsDisabled,
	NoticeIncompatibleBlock,
} from './utils/notices-tips';
import hasVisibilityControls from './../utils/has-visibility-controls';
import hasPermission from './../utils/has-permission';
import getEnabledControls from './../../utils/get-enabled-controls';

// Provides an entry point to slot in additional settings. Must be placed
// outside of function to avoid unnecessary rerenders.
const AdditionalInspectorControls = withFilters(
	'blockVisibility.addInspectorControls'
)( ( props ) => <></> ); // eslint-disable-line

/**
 * Add the Visibility inspector control to each allowed block in the editor
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
function VisibilityInspectorControls( props ) {
	const {
		attributes,
		setAttributes,
		name,
		settings,
		variables,
		clientId,
	} = props;

	if ( settings === 'fetching' || variables === 'fetching' ) {
		return null;
	}

	if (
		! hasPermission( settings, variables ) || // Does the user haver permission to edit visibility settings?
		! hasVisibilityControls( settings, name ) // Does the block type have visibility controls?
	) {
		return null;
	}

	const enabledControls = getEnabledControls( settings, variables );
	const defaultControlSettings =
		settings?.plugin_settings?.default_controls ?? {};
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
		};
	}

	const blockAttributes = { ...attributes };
	let blockAtts = blockAttributes?.blockVisibility;
	let controlSets = blockAtts?.controlSets ?? [];

	// Create the default control set if none exist.
	if ( controlSets.length === 0 ) {
		const defaultSet = [
			{
				id: 1,
				enable: true,
				controls: defaultControls,
			},
		];
		controlSets = defaultSet;
		blockAtts = assign( { ...blockAtts }, { controlSets } );
	}

	const settingsUrl = variables?.plugin_variables?.settings_url ?? ''; // eslint-disable-line
	const hideBlock = blockAtts?.hideBlock ?? false;
	const hasHideBlock = enabledControls.some(
		( control ) => control.settingSlug === 'hide_block'
	);
	const blockHidden = hasHideBlock && hideBlock;

	// There are a few core blocks that are not compatible.
	const incompatibleBlocks = [ 'core/legacy-widget' ];
	const blockIsIncompatible = incompatibleBlocks.includes( name );

	function setControlSetAtts( controlSetAtts ) {
		// This will need to be updated when multiple control sets are enabled.
		setAttributes( {
			blockVisibility: assign(
				{ ...attributes.blockVisibility },
				{ controlSets: [ ...[ controlSetAtts ] ] } // Ok for now since only one control set available.
			),
		} );
	}

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
					{ enabledControls.length !== 0 && ! blockIsIncompatible && (
						<>
							<Slot name="InspectorControlsTop" />
							<HideBlock
								enabledControls={ enabledControls }
								{ ...props }
							/>
							<Slot name="InspectorControlsMiddle" />
							{ ! blockHidden &&
								controlSets.map( ( controlSet, index ) => {
									return (
										<ControlSet
											key={ clientId + index }
											type={ 'single' }
											controlSets={ controlSets }
											controlSetAtts={ controlSet }
											setControlSetAtts={
												setControlSetAtts
											}
											enabledControls={ enabledControls }
											defaultControls={ defaultControls }
											{ ...props }
										/>
									);
								} ) }
							<Slot name="InspectorControlsBottom" />
						</>
					) }
					{ enabledControls.length === 0 && ! blockIsIncompatible && (
						<NoticeControlsDisabled settingsUrl={ settingsUrl } />
					) }
					{ blockIsIncompatible && (
						<NoticeIncompatibleBlock name={ name } />
					) }
				</div>
			</PanelBody>
			<AdditionalInspectorControls
				blockAtts={ blockAtts }
				enabledControls={ enabledControls }
				{ ...props }
			/>
		</InspectorControls>
	);
}

export default withSelect( ( select ) => {
	const { getEntityRecord } = select( 'core' );
	const settings =
		getEntityRecord( 'block-visibility/v1', 'settings' ) ?? 'fetching';
	const variables =
		getEntityRecord( 'block-visibility/v1', 'variables' ) ?? 'fetching';

	return { settings, variables };
} )( VisibilityInspectorControls );
