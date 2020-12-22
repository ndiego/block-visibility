/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Fetch plugin data from the REST api.
 *
 * @since 1.3.0
 * @param {string} kind The kind of data to fetch. Valid kinds are: settings, variables
 * @return {Object}		Return fetched data object
 */
export function usePluginData( kind ) {
	const { data = 'fetching' } = useSelect( ( select ) => {
		const { getEntityRecord } = select( 'core' );
		return { data: getEntityRecord( 'block-visibility/v1', kind ) };
	}, [] );
	return data;
}
