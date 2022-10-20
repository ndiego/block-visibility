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
import { useSelect } from '@wordpress/data';

/**
 * Add the Selected Users control to the main Visibility By User Role control
 *
 * @since 2.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function Users( props ) {
	const { variables, userRole, setControlAtts } = props;
	const restrictedUsers = userRole?.restrictedUsers ?? [];
	const hideOnRestrictedUsers = userRole?.hideOnRestrictedUsers ?? false;

	const users = useSelect( ( select ) => {
		// Requires `list_users` capability, will fail if user is not admin.
		const data = select( 'core' ).getUsers( { per_page: -1 } );
		const allUsers = [];

		if ( data && data.length !== 0 ) {
			data.forEach( ( user ) => {
				const value = { value: user.id, label: user.name };
				allUsers.push( value );
			} );
		}

		return allUsers;
	}, [] );

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

	const label = hideOnRestrictedUsers
		? __( 'Hide the block from', 'block-visibility' )
		: __( 'Show the block to', 'block-visibility' );

	const selectedUsers = users.filter( ( user ) =>
		restrictedUsers.includes( user.value )
	);

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
			<div className="components-base-control__help">
				{ sprintf(
					// Translators: Whether the block is hidden or visible.
					__( '%s the selected users.', 'block-visibility' ),
					label
				) }
			</div>
			<Select
				className="block-visibility__react-select"
				classNamePrefix="react-select"
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
