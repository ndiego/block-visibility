/**
 * External dependencies
 */
import { isUndefined } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Button, Disabled, Notice } from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import ControlSet from './control-set';
import { InformationPopover } from './../../components';
import links from './../../utils/links';

/**
 * Render the control set manager for the selected preset.
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 */
export default function ControlSets( props ) {
	const {
		enabledControls,
		presetAttributes,
		setPresetAttributes,
		controlSets,
		setHasUpdates,
		variables,
	} = props;

	const settingsUrl = variables?.plugin_variables?.settings_url ?? '';
	const layout = presetAttributes?.layout ?? 'columns';
	const hideBlock = presetAttributes?.hideBlock ?? false;

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

	return (
		<div className="control-sets">
			<div className="control-sets__header">
				<div className="control-sets__header-title">
					<h2>{ __( 'Control Sets', 'block-visibility' ) }</h2>
					<InformationPopover
						message={ __(
							'Each control set represents a group of visibility controls that form “AND” conditions. All controls within a control set must be satisfied for the block to be visible.',
							'block-visibility'
						) }
						subMessage={ __(
							'Multiple control sets allow you to create "OR" conditions between each set.',
							'block-visibility'
						) }
						link={ links.editorVisibilityPresets }
						position="bottom center"
					/>
				</div>
				<div className="control-sets__description">
					{ __(
						'Show the block if at least one control set applies.',
						'block-visibility'
					) }
				</div>
			</div>
			{ enabledControls.length > 0 && (
				<div className="control-sets__container-outer">
					<div
						className={ classnames( 'control-sets__container', {
							'is-rows': layout === 'rows',
						} ) }
					>
						{ controlSets.map( ( controlSet, index ) => (
							<div
								key={ index }
								className="control-set__container"
							>
								{ [
									! hideBlock && (
										<ControlSet
											key={ index }
											index={ index }
											controlSetAtts={ controlSet }
											setControlSetAtts={
												setControlSetAtts
											}
											{ ...props }
										/>
									),
									hideBlock && (
										<div className="control-set__disabled">
											<Disabled>
												<ControlSet
													key={ index }
													index={ index }
													controlSetAtts={
														controlSet
													}
													setControlSetAtts={
														setControlSetAtts
													}
													{ ...props }
												/>
											</Disabled>
										</div>
									),
								] }
							</div>
						) ) }
						<div className="control-set__inserter-button">
							<Button
								label={ __(
									'Add control set',
									'block-visibility'
								) }
								icon={ plus }
								onClick={ addControlSet }
								isPrimary
								isSmall
							/>
						</div>
					</div>
				</div>
			) }
			{ enabledControls.length === 0 && (
				<div className="control-sets__notices">
					<Notice status="warning" isDismissible={ false }>
						{ createInterpolateElement(
							__(
								'All visibility controls have been manually disabled. Visit the <a>plugin settings</a> to re-enable.',
								'block-visibility'
							),
							{
								a: (
									<a // eslint-disable-line
										href={
											settingsUrl +
											'&tab=visibility-controls'
										}
										target="_blank"
										rel="noreferrer"
									/>
								),
							}
						) }
					</Notice>
				</div>
			) }
		</div>
	);
}
