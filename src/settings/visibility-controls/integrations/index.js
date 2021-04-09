/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ACF from './acf';
import WPFusion from './wp-fusion';

/**
 * Renders all the control settings.
 *
 * @since 1.8.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function Integrations( props ) {
	const { variables } = props;
	let activeIntegrations = variables?.integrations ?? {};

	activeIntegrations = Object.keys( activeIntegrations ).map( ( key ) => {
		return activeIntegrations[ key ];
	} );

	activeIntegrations = activeIntegrations.filter(
		( integration ) => integration.active === true
	);

	// If there are no active integrations, hide this section.
	if ( activeIntegrations.length === 0 ) {
		return null;
	}

	return (
		<div className="setting-tabs__settings-panel">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					{ __( 'Third-Party Integrations', 'block-visibility' ) }
				</span>
			</div>
			<div className="settings-panel__container">
				<ACF { ...props } />
				<WPFusion { ...props } />
			</div>
		</div>
	);
}
