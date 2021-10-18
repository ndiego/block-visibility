/**
 * External dependencies
 */
import { isEmpty, isUndefined } from 'lodash';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { columns, stretchFullWidth } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import ControlSet from './../inspector-controls/control-set';
import getEnabledControls from './../../utils/get-enabled-controls';

/**
 * Render the control set manager for the selected preset.
 *
 * @since TBD
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function ControlSets( props ) {
	const {
		presetAttributes,
		setPresetAttributes,
		setHasUpdates,
		settings,
		variables,
	} = props;
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

	function addControlSet() {
		const maxId = Math.max( ...controlSets.map( ( set ) => set.id ), 0 );
		const setId = maxId + 1;
		const defaultSet = {
			id: setId,
			enable: true,
			controls: defaultControls,
		};

		setPresetAttributes( {
			...presetAttributes,
			controlSets: [ ...controlSets, defaultSet ],
		} );
		setHasUpdates( true );
	}

	function setControlSetAtts( controlSetAtts, remove = false ) {
		const newControlSets = [ ...controlSets ];
		let index;

		// Find the control set that we are updating.
		newControlSets.forEach( ( set, i ) => {
			if ( set.id === controlSetAtts.id ) {
				index = i;
			}
		} );

		// Add, update or remove the control set.
		if ( ! remove ) {
			if ( isUndefined( index ) ) {
				newControlSets.push( controlSetAtts );
			} else {
				newControlSets[ index ] = controlSetAtts;
			}
		} else {
			newControlSets.splice( index, 1 );
		}

		setPresetAttributes( {
			...presetAttributes,
			controlSets: [ ...newControlSets ],
		} );
		setHasUpdates( true );
	}

	return (
		<div className="control-sets">
			<div className="control-sets__controls">
				<Button isPrimary onClick={ addControlSet }>
					{ __( 'Add control set', 'block-visibility' ) }
				</Button>
				<div className="control-sets__controls-layouts">
					<Button
						icon={ stretchFullWidth }
						onClick={ () => console.log( 'test' ) }
					/>
					<Button
						icon={ columns }
						onClick={ () => console.log( 'test' ) }
					/>
				</div>
			</div>
			<div className="control-sets__container">
				{ controlSets.map( ( controlSet, index ) => {
					return (
						<ControlSet
							key={ index }
							type={ 'multiple' }
							controlSets={ controlSets }
							controlSetAtts={ controlSet }
							setControlSetAtts={ setControlSetAtts }
							enabledControls={ enabledControls }
							defaultControls={ defaultControls }
							settings={ settings }
							variables={ variables }
							{ ...props }
						/>
					);
				} ) }
			</div>
		</div>
	);
}
