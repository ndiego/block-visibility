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
	const { roles, enabledUserRoles, onPluginSettingChange } = props;

	return (
		<div className="settings-panel__container-subsetting">
			{ roles.map( ( role ) => {
				const newEnabledUserRoles = [ ...enabledUserRoles ];
				const isChecked = enabledUserRoles.includes( role );

				if ( isChecked ) {
					const index = newEnabledUserRoles.indexOf( role );
					index > -1 && newEnabledUserRoles.splice( index, 1 ); // eslint-disable-line
				} else {
					newEnabledUserRoles.indexOf( role ) === -1 && // eslint-disable-line
						newEnabledUserRoles.push( role );
				}

				return (
					<CheckboxControl
						key={ role }
						checked={ isChecked }
						label={ <span>{ startCase( role ) + 's' }</span> }
						onChange={ () =>
							onPluginSettingChange(
								'enabled_user_roles',
								newEnabledUserRoles
							)
						}
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
