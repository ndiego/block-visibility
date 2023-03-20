/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
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
 * @since 1.3.0
 */
export default function PresetManager() {
	const [ presetAttributes, setPresetAttributes ] = useState( {} );
	const [ hasUpdates, setHasUpdates ] = useState( false );

	const { presets, settings, variables } = useSelect( ( select ) => {
		const { getEntityRecords, getEntityRecord } = select( 'core' );

		return {
			presets:
				getEntityRecords( 'postType', 'visibility_preset', {
					per_page: -1,
					orderby: 'modified',
				} ) ?? 'fetching',
			settings: getEntityRecord( 'block-visibility/v1', 'settings' ),
			variables: getEntityRecord( 'block-visibility/v1', 'variables' ),
		};
	}, [] );

	// Get all enabled controls and make sure to exclude the Hide Block and
	// Visibility Presets controls.
	const enabledControls = getEnabledControls( settings, variables ).filter(
		( control ) =>
			control.attributeSlug !== 'hideBlock' &&
			control.attributeSlug !== 'visibilityPresets'
	);

	let controlSets = presetAttributes?.controlSets ?? [];

	// Create the default control set if none exist.
	if ( controlSets.length === 0 ) {
		controlSets = [
			{
				id: 1,
				enable: true,
			},
		];
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
							presets={ presets }
							controlSets={ controlSets }
							enabledControls={ enabledControls }
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
