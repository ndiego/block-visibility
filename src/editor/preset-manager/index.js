/**
 * External dependencies
 */
import { includes, isUndefined, pickBy, isEmpty } from 'lodash';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import PresetSidebar from './preset-sidebar';
import PresetHeader from './preset-header';
import ControlSets from './control-sets';
import getEnabledControls from './../../utils/get-enabled-controls';

/**
 * Render the preset manager.
 *
 * @since TBD
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function PresetManager( props ) {
	const [ presetAttributes, setPresetAttributes ] = useState( {} );
	const [ hasUpdates, setHasUpdates ] = useState( false );

	const { presets, settings, variables } = useSelect( ( select ) => {
		const { getEntityRecords, getEntityRecord, getUsers } = select(
			coreStore
		);

		const presetQuery = pickBy(
			{
				// categories: catIds,
				// author: selectedAuthor,
				// order,
				// orderby: orderBy,
				per_page: -1,
			},
			( value ) => ! isUndefined( value )
		);

		const presets =
			getEntityRecords( 'postType', 'bv_preset', presetQuery ) ??
			'fetching';
		const variables = getEntityRecord( 'block-visibility/v1', 'variables' );
		const settings = getEntityRecord( 'block-visibility/v1', 'settings' );

		return { presets, settings, variables };
	}, [] );

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

	let controlSets = presetAttributes?.controlSets ?? [];

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
	}

	function addNewPreset() {
		setPresetAttributes( {
			title: '',
			enable: true,
		} );
		setHasUpdates( true );
	}

	return (
		<div className="preset-manager">
			<PresetSidebar
				presetAttributes={ presetAttributes }
				setPresetAttributes={ setPresetAttributes }
				presets={ presets }
				addNewPreset={ addNewPreset }
				hasUpdates={ hasUpdates }
				setHasUpdates={ setHasUpdates }
			/>
			<div className="preset-manager__content">
				{ isEmpty( presetAttributes ) && (
					<div className="preset-manager__content-placeholder">
						<Button isPrimary onClick={ () => addNewPreset() }>
							{ __( 'New preset', 'block-visibility' ) }
						</Button>
						<p>
							{ [
								isEmpty( presets ) &&
									__(
										'To get started, create a new visibility preset.',
										'block-visibility'
									),
								! isEmpty( presets ) &&
									__(
										'Create a new visibility preset or edit an existing one.',
										'block-visibility'
									),
							] }
						</p>
					</div>
				) }
				{ ! isEmpty( presetAttributes ) && (
					<>
						<PresetHeader
							presetAttributes={ presetAttributes }
							setPresetAttributes={ setPresetAttributes }
							controlSets={ controlSets }
							enabledControls={ enabledControls }
							defaultControls={ defaultControls }
							hasUpdates={ hasUpdates }
							setHasUpdates={ setHasUpdates }
							settings={ settings }
							variables={ variables }
						/>
						<ControlSets
							presetAttributes={ presetAttributes }
							setPresetAttributes={ setPresetAttributes }
							controlSets={ controlSets }
							enabledControls={ enabledControls }
							defaultControls={ defaultControls }
							setHasUpdates={ setHasUpdates }
							settings={ settings }
							variables={ variables }
						/>
					</>
				) }
			</div>
		</div>
	);
}
