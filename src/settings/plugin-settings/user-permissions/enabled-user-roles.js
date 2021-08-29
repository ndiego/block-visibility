/**
 * External dependencies
 */
import { startCase } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { CheckboxControl } from '@wordpress/components';

/**
 * Renders the additional permission settings for user roles.
 *
 * @since 1.3.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function EnabledUserRoles( props ) {
	const { pluginSettings, setPluginSettings } = props;
	const roles = [ 'editor', 'author', 'contributor' ];

	// Manually set defaults, this ensures the main settings function properly
	const enabledRoles = pluginSettings?.enabled_user_roles ?? []; // eslint-disable-line

	return (
		<div className="subsetting">
			{ roles.map( ( role ) => {
				const newEnabledRoles = [ ...enabledRoles ];
				const isChecked = enabledRoles.includes( role );

				if ( isChecked ) {
					const index = newEnabledRoles.indexOf( role );
					index > -1 && newEnabledRoles.splice( index, 1 ); // eslint-disable-line
				} else {
					newEnabledRoles.indexOf( role ) === -1 && // eslint-disable-line
						newEnabledRoles.push( role );
				}

				return (
					<CheckboxControl
						key={ role }
						checked={ isChecked }
						label={ <span>{ startCase( role ) + 's' }</span> }
						onChange={ () => {
							setPluginSettings( {
								...pluginSettings,
								enabled_user_roles: newEnabledRoles,
							} );
						} }
					/>
				);
			} ) }
			<div className="settings-panel__help">
				{ __(
					'Choose which user roles should be allowed to control visibility settings in the Block Editor. Administrators will always have permission.',
					'block-visibility'
				) }
			</div>
		</div>
	);
}
