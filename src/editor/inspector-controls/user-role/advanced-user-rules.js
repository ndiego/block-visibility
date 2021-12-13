/**
 * External dependencies
 */
import { map, assign, includes } from 'lodash'; // eslint-disable-line
import Select from 'react-select';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Button, ToggleControl, Notice } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';


import RuleSets from './../utils/rule-sets';
import { getGroupedFields, getAllFields } from './fields';

/**
 * Add the Advanced User Rules control to the main User Role control
 *
 * @since 2.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function AdvancedUserRules( props ) {
	const { variables, userRole, setControlAtts } = props;
	const restrictedUsers = userRole?.restrictedUsers ?? [];

	const hideOnRuleSets = userRole?.hideOnRuleSets ?? false;
    const ruleSets = userRole?.ruleSets ?? [];

    if ( ruleSets.length === 0 ) {
        ruleSets.push( {
            enable: true,
            rules: [ { field: '' } ],
        } );
    }

    const addRuleSet = () => {
        const newRuleSets = [
            ...ruleSets,
            {
                enable: true,
                rules: [ { field: '' } ],
            },
        ];

        setControlAtts(
            'userRole',
            assign( { ...userRole }, { ruleSets: [ ...newRuleSets ] } )
        );
    };

    const groupedFields = getGroupedFields();
    const allFields = getAllFields( variables );

	const currentUsersRoles = variables?.current_users_roles ?? [];
	const isAdmin = currentUsersRoles.includes( 'administrator' ) ?? false;

	if ( ! isAdmin ) {
		return (
			<Notice status="warning" isDismissible={ false }>
				{ __(
					'The Users option can only be configured by website Administrators. Please choose another option.',
					'block-visibility'
				) }
			</Notice>
		);
	}

    const ruleLabel = ( ruleIndex ) => {
        if ( ruleIndex === 0 ) {
            return sprintf(
                // Translators: Whether the block is hidden or visible.
                __( '%s the block for', 'block-visibility' ),
                hideOnRuleSets
                    ? __( 'Hide', 'block-visibility' )
                    : __( 'Show', 'block-visibility' )
            );
        }

        return __( 'And for', 'block-visibility' );
    };

	return (
		<div className="visibility-control__container">
			<div className="visibility-control advanced">
                <div className="visibility-control__help">
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
                <div className="rule-sets__add-rule-set">
                    <Button onClick={ () => addRuleSet() } isSecondary>
                        { __( 'Add rule set', 'block-visibility' ) }
                    </Button>
                </div>
                <div className="hide-on-rule-sets">
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
		</div>
	);
}
