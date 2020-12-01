/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelBody, Notice, withFilters } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import {
	__experimentalCreateInterpolateElement,
	createInterpolateElement,
} from '@wordpress/element';
import { useDispatch, withSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';




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
import HideBlock from './hide-block';
import VisibilityByRole from './visibility-by-role';
import DateTime from './date-time';
import { getEnabledControls } from './../utils/setting-utilities';
import { hasVisibilityControls } from './../utils/has-visibility-controls';
//import useFetch from './../utils/fetch-data';

/**
 * Add the Visibility inspector control to each allowed block in the editor
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function VisibilityInspectorControls( props ) {
	//const{ settings } = useEntityProp( 'block-visibility/v1', 'settings' );
	//const{ settings } = useEntityProp( 'root', 'site', 'block_visibility_settings' )
	//const data = useFetch( 'settings' );
	//const settings = data.settings;

	const settings = useSelect( ( select ) => {
		const { getEntityRecord } = select( 'core' );
		return getEntityRecord( 'block-visibility/v1', 'settings' );
	}, [] );

	const { name, attributes } = props;
	// TODO: Find a solution to the global variable issue.
	//const settings = blockVisibilityData.settings; // eslint-disable-line
	const hasVisibility = hasVisibilityControls( settings, name, attributes );

	if ( ! hasVisibility ) {
		return null;
	}

	// TODO: Find a solution to the global variable issue.
	const settingsUrl = blockVisibilityData.pluginVariables.settingsUrl; // eslint-disable-line
	const enabledControls = getEnabledControls( settings );

	return (
		<InspectorControls>
			<PanelBody
				title={ __( 'Visibility', 'block-visibility' ) }
				className="block-visibility-settings"
				initialOpen={ false }
			>
				<div className="block-visibility-settings__visibility-controls">
					{ enabledControls.length !== 0 && (
						<>
							<HideBlock
								enabledControls={ enabledControls }
								{ ...props }
							/>
							<DateTime
								settings={ settings }
								enabledControls={ enabledControls }
								{ ...props }
							/>
							<VisibilityByRole
								settings={ settings }
								enabledControls={ enabledControls }
								{ ...props }
							/>
							<AdditionalInspectorControls
								settings={ settings }
								enabledControls={ enabledControls }
								{ ...props }
							/>
						</>
					) }
					{ enabledControls.length === 0 && (
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
