/**
 * External dependencies
 */
import { has, filter } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelBody, Notice, withFilters } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { useEntityProp } from '@wordpress/core-data';
import {
	__experimentalCreateInterpolateElement,
	createInterpolateElement,
} from '@wordpress/element';

/**
 * Temporary solution until WP 5.5 is released with createInterpolateElement
 */
const interpolateElement =
	typeof createInterpolateElement === 'function'
		? createInterpolateElement
		: __experimentalCreateInterpolateElement;

/**
 * Internal dependencies
 */
import HideBlock from './components/hide-block';
import VisibilityByRole from './components/visibility-by-role';

import { isSettingEnabled } from './utils/is-setting-enabled';
import { isVisibilityControlEnabled } from './utils/is-visibility-control-enabled';
import { hasVisibilityControls } from './utils/has-visibility-controls';

/**
 * Add the Visibility inspector control to each allowed block in the editor
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function VisibilityInspectorControls( props ) {
	// Retrieve the block visibility settings: https://github.com/WordPress/gutenberg/issues/20731
	const [
		blockVisibilitySettings,
		setBlockVisibilitySettings // eslint-disable-line
	] = useEntityProp( 'root', 'site', 'block_visibility_settings' );
	// This is a global variable added to the page via PHP
	const settingsUrl = blockVisibilityVariables.settingsUrl; // eslint-disable-line
	// Need to wait until the main settings object is loaded.
	const visibilityControls = blockVisibilitySettings
		? blockVisibilitySettings.visibility_controls
		: null;

	const { name, attributes } = props;
	const { blockVisibility } = attributes;

	if ( ! hasVisibilityControls( blockVisibilitySettings, name, attributes ) ) {
		return null;
	}

	const controlsEnabled = filter( visibilityControls, { enable: true } ).length; // eslint-disable-line

	// Check if the hide block control is set, default to "true".
	const hideBlockEnable = visibilityControls?.hide_block?.enable ?? true; // eslint-disable-line
	const showAdditionalControls =
		! blockVisibility.hideBlock || ! hideBlockEnable ? true : false;

	return (
		<InspectorControls>
			<PanelBody
				title={ __( 'Visibility', 'block-visibility' ) }
				className="block-visibility-settings"
				initialOpen={ false }
			>
				<div className="block-visibility-settings__visibility-controls">
					{ controlsEnabled > 0 && (
						<>
							{ hideBlockEnable && <HideBlock { ...props } /> }
							{ showAdditionalControls && (
								<>
									<VisibilityByRole
										visibilityControls={
											visibilityControls
										}
										{ ...props }
									/>
									<AdditionalInspectorControls
										visibilityControls={
											visibilityControls
										}
										{ ...props }
									/>
								</>
							) }
						</>
					) }
					{ ! controlsEnabled && (
						<Notice status="warning" isDismissible={ false }>
							{ interpolateElement(
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
		</InspectorControls>
	);
}

let AdditionalInspectorControls = ( props ) => <></>; // eslint-disable-line
AdditionalInspectorControls = withFilters(
	'blockVisibility.AdditionalInspectorControls'
)( AdditionalInspectorControls );
