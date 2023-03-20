/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Get all taxonomies.
 * Note that only 100 taxonomies are fetched by default.
 *
 * @since 3.0.0
 * @return {Array} All taxonomies.
 */
export default function useTaxonomies() {
	const taxonomies = useSelect( ( select ) => {
		const availableTaxonomies = select( 'core' ).getTaxonomies( {
			per_page: -1,
		} );
		let visibleTaxonomies = [];

		if ( availableTaxonomies && availableTaxonomies.length !== 0 ) {
			visibleTaxonomies = availableTaxonomies.filter(
				( taxonomy ) => taxonomy.visibility?.show_ui
			);
		}

		return visibleTaxonomies;
	}, [] );

	return taxonomies;
}
