/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Get all users.
 * Requires `list_users` capability, will fail if user is not admin.
 *
 * @since 2.5.0
 * @param {boolean} isAdmin Is the user an administrator
 * @return {Array} All users.
 */
export default function useAllUsers( isAdmin = true ) {
	const users = useSelect( ( select ) => {
		// If a non-admin is attempting to fetch users, return an empty array.
		if ( ! isAdmin ) {
			return [];
		}

		const query = {
			per_page: -1,
			_fields: 'id,name',
		};

		const data = select( 'core' ).getUsers( query );
		const allUsers = [];

		if ( data && data.length !== 0 ) {
			data.forEach( ( user ) => {
				const value = { value: user.id, label: user.name };
				allUsers.push( value );
			} );
		}

		return allUsers;
	}, [] );

	return users;
}
