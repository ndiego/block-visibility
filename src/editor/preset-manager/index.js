/**
 * External dependencies
 */
import {
	assign,
	get,
	includes,
	invoke,
	isUndefined,
	pickBy,
	isEmpty,
} from 'lodash';

/**
 * WordPress dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';
import { dispatch, useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { store as coreStore } from '@wordpress/core-data';
import {
	Button,
	Modal,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { PluginMoreMenuItem } from '@wordpress/edit-post';

/**
 * Internal dependencies.
 */
import PresetSidebar from './preset-sidebar';
import PresetHeader from './preset-header';
import ControlSets from './control-sets';

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
							hasUpdates={ hasUpdates }
							setHasUpdates={ setHasUpdates }
							settings={ settings }
							variables={ variables }
						/>
						<ControlSets
							presetAttributes={ presetAttributes }
							setPresetAttributes={ setPresetAttributes }
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
