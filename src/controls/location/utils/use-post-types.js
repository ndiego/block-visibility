/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Get all public post types.
 * Note that only 100 post types are fetched by default.
 *
 * @since 3.0.0
 * @return {Array} All public post types.
 */
export default function usePostTypes() {
	const postTypes = useSelect( ( select ) => {
		const availablePostTypes = select( 'core' ).getPostTypes( {
			per_page: -1,
		} );
		let publicPostTypes = [];

		// Remove post types that are not public and also remove media (attachements).
		if ( availablePostTypes && availablePostTypes.length !== 0 ) {
			publicPostTypes = availablePostTypes.filter(
				( postType ) =>
					postType.viewable && postType.slug !== 'attachment'
			);
		}

		return ( publicPostTypes ?? [] ).map( ( postType ) => {
			const label = postType.labels?.singular_name ?? postType.name;

			return {
				value: postType.slug,
				label: decodeEntities( label ),
				taxonomies: postType.taxonomies,
				hasArchive:
					postType.slug === 'post' ? true : postType.has_archive,
				isHierarchical: postType.hierarchical,
			};
		} );
	}, [] );

	return postTypes;
}
