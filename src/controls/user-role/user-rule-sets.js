/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Notice, ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { RuleSets } from './../../components';
import { getGroupedFields, getAllFields } from './fields';

/**
 * Add the User Rule Sets control to the main User Role control
 *
 * @since 2.3.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function UserRuleSets( props ) {
	const { ruleSets, setControlAtts, userRole, variables } = props;
	const hideOnRuleSets = userRole?.hideOnRuleSets ?? false;
	const groupedFields = getGroupedFields();
	const allFields = getAllFields( variables );
	const currentUsersRoles = variables?.current_users_roles ?? [];
	const isAdmin = currentUsersRoles.includes( 'administrator' ) ?? false;

	if ( ! isAdmin ) {
		return (
			<Notice status="warning" isDismissible={ false }>
				{ __(
					'The User rule sets option can only be configured by website Administrators. Please choose another option.',
					'block-visibility'
				) }
			</Notice>
		);
	}

	return (
		<>
			<div className="control-fields-item">
				<div className="components-base-control__help">
					{ sprintf(
						// Translators: Whether the block is hidden or visible.
						__(
							'%s the block if at least one user rule set applies.',
							'block-visibility'
						),
						hideOnRuleSets
							? __( 'Hide', 'block-visibility' )
							: __( 'Show', 'block-visibility' )
					) }
				</div>
				<div className="rule-sets">
					{ ruleSets.map( ( ruleSet, ruleSetIndex ) => {
						return (
							<RuleSets
								key={ ruleSetIndex }
								ruleSet={ ruleSet }
								ruleSetIndex={ ruleSetIndex }
								ruleSets={ ruleSets }
								groupedFields={ groupedFields }
								allFields={ allFields }
								controlName="userRole"
								controlAtts={ userRole }
								hideOnRuleSets={ hideOnRuleSets }
								{ ...props }
							/>
						);
					} ) }
				</div>
				<div className="control-fields-item__hide-when">
					<ToggleControl
						label={ __(
							'Hide when rules apply',
							'block-visibility'
						) }
						checked={ hideOnRuleSets }
						onChange={ () =>
							setControlAtts(
								'userRole',
								assign(
									{ ...userRole },
									{ hideOnRuleSets: ! hideOnRuleSets }
								)
							)
						}
					/>
				</div>
			</div>
		</>
	);
}
