/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelBody, Notice, withFilters, Slot } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import HideBlock from './hide-block';
import VisibilityByRole from './visibility-by-role';
import DateTime from './date-time';
import { getEnabledControls } from './../utils/setting-utilities';
import hasVisibilityControls from './../utils/has-visibility-controls';
import hasPermission from './../utils/has-permission';
import usePluginData from './../utils/use-plugin-data';

/**
 * Add the Visibility inspector control to each allowed block in the editor
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function VisibilityInspectorControls( props ) {
	const settings = usePluginData( 'settings' );
	const variables = usePluginData( 'variables' );

	if ( settings === 'fetching' || variables === 'fetching' ) {
		return null;
	}

	if ( ! hasPermission( settings, variables ) ) {
		return null;
	}

	const { name, attributes } = props;
	const hasVisibility = hasVisibilityControls( settings, name, attributes );

	if ( ! hasVisibility ) {
		return null;
	}

	const settingsUrl = variables?.pluginVariables.settingsUrl ?? ''; // eslint-disable-line
	const enabledControls = getEnabledControls( settings );

	// Provides an entry point to slot in additional settings.
	const AdditionalControls = withFilters(
		'blockVisibility.InspectorControls'
	)( ( props ) => <></> ); // eslint-disable-line

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
								{ ...props }
							/>
							<Slot name="InspectorControlsMiddle" />
							<DateTime
								settings={ settings }
								variables={ variables }
								enabledControls={ enabledControls }
								{ ...props }
							/>
							<VisibilityByRole
								settings={ settings }
								variables={ variables }
								enabledControls={ enabledControls }
								{ ...props }
							/>
							<Slot name="InspectorControlsBottom" />
						</>
					) }
					{ enabledControls.length === 0 && (
						<Notice status="warning" isDismissible={ false }>
							{ createInterpolateElement(
								__(
									'Looks like all Visibility Controls have been disabled. To control block visibility again, re-enable some <a>Visibility Controls</a>.',
									'block-visibility'
								),
								{
									a: (
										<a // eslint-disable-line
											href={ settingsUrl }
											target="_blank"
											rel="noreferrer"
										/>
									),
								}
							) }
						</Notice>
					) }
				</div>
			</PanelBody>
			<AdditionalControls
				settings={ settings }
				variables={ variables }
				enabledControls={ enabledControls }
				{ ...props }
			/>
		</InspectorControls>
	);
}
