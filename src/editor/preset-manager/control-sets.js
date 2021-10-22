/**
 * External dependencies
 */
import { isEmpty, isUndefined } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Button, Disabled } from '@wordpress/components';

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
		controlSets,
		enabledControls,
		defaultControls,
		setHasUpdates,
		settings,
		variables,
	} = props;

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

    const layout = presetAttributes?.layout ?? 'columns';
	const hideBlock = presetAttributes?.hideBlock ?? false;

	let controlSetMarkup = ( controlSet, index ) => (
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

	return (
		<div className="control-sets">
			<div
                className={ classnames(
                    'control-sets__container',
                    { 'is-rows': layout === 'rows' }
                ) }
            >
				{ controlSets.map( ( controlSet, index ) => {
					if ( hideBlock ) {
						return (
							<div className="control-set-disabled">
								<Disabled>
									{ controlSetMarkup( controlSet, index ) }
								</Disabled>
							</div>
						)
					}

					return controlSetMarkup( controlSet, index );
				} ) }
			</div>
		</div>
	);
}
