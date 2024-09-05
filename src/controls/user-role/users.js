/**
 * External dependencies
 */
import { map, assign, includes } from 'lodash'; // eslint-disable-line
import Select from 'react-select';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { ToggleControl, Notice } from '@wordpress/components';

/**
 * Internal dependencies
 */
import useAllUsers from './utils/use-all-users';
import { ClearIndicator, DropdownIndicator, IndicatorSeparator, MultiValueRemove } from '../../utils/react-select-utils';

/**
 * Add the Selected Users control to the main Visibility By User Role control
 *
 * @since 2.0.0
 * @param {Object} props All the props passed to this function
 */
export default function Users( props ) {
	const { variables, userRole, setControlAtts, enableNotices } = props;
	const restrictedUsers = userRole?.restrictedUsers ?? [];
	const hideOnRestrictedUsers = userRole?.hideOnRestrictedUsers ?? false;
	const currentUsersRoles = variables?.current_users_roles ?? [];
	const isAdmin = currentUsersRoles.includes( 'administrator' ) ?? false;
	const users = useAllUsers( isAdmin );

	if ( ! isAdmin ) {
		return (
			<Notice status="warning" isDismissible={ false }>
				{ __(
					'Website Administrators can only configure the Users option. Please choose another option.',
					'block-visibility'
				) }
			</Notice>
		);
	}

	const selectedUsers = users.filter( ( user ) =>
		restrictedUsers.includes( user.value )
	);

	const label = hideOnRestrictedUsers
		? __( 'Hide the block from', 'block-visibility' )
		: __( 'Show the block to', 'block-visibility' );

	const handleOnChange = ( _users ) => {
		const newUsers = [];

		if ( _users.length !== 0 ) {
			_users.forEach( ( user ) => {
				newUsers.push( user.value );
			} );
		}

		setControlAtts(
			'userRole',
			assign(
				{ ...userRole },
				{
					restrictedUsers: newUsers,
				}
			)
		);
	};

	return (
		<div className="control-fields-item">
			{ enableNotices && (
				<div className="components-base-control__help">
					{ sprintf(
						// Translators: Whether the block is hidden or visible.
						__( '%s the selected users.', 'block-visibility' ),
						label
					) }
				</div>
			) }
			<Select
				className="block-visibility__react-select"
				classNamePrefix="react-select"
				components={ { ClearIndicator, DropdownIndicator, IndicatorSeparator, MultiValueRemove } }
				options={ users }
				value={ selectedUsers }
				placeholder={ __( 'Select Users…', 'block-visibility' ) }
				onChange={ ( value ) => handleOnChange( value ) }
				isMulti
				isLoading={ users.length === 0 }
			/>
			<div className="control-fields-item__hide-when">
				<ToggleControl
					label={ __(
						'Hide from selected users',
						'block-visibility'
					) }
					checked={ hideOnRestrictedUsers }
					onChange={ () =>
						setControlAtts(
							'userRole',
							assign(
								{ ...userRole },
								{
									hideOnRestrictedUsers:
										! hideOnRestrictedUsers,
								}
							)
						)
					}
				/>
			</div>
		</div>
	);
}
