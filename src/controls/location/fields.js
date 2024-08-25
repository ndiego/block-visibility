/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import usePostTypes from './utils/use-post-types';
import useTaxonomies from './utils/use-taxonomies';
import prepareGroupedFields from './../utils/prepare-grouped-field';

const valueOperators = [
	{
		value: 'equal',
		label: __( 'Is equal to', 'block-visibility' ),
	},
	{
		value: 'notEqual',
		label: __( 'Is not equal to', 'block-visibility' ),
	},
	{
		value: 'greaterThan',
		label: __( 'Is greater than', 'block-visibility' ),
	},
	{
		value: 'lessThan',
		label: __( 'Is less than', 'block-visibility' ),
	},
	{
		value: 'greaterThanEqual',
		label: __( 'Is greater or equal to', 'block-visibility' ),
	},
	{
		value: 'lessThanEqual',
		label: __( 'Is less than or equal to', 'block-visibility' ),
	},
];

const taxonomyOperators = [
	{
		value: 'atLeastOne',
		label: __( 'Is at least one of the selected', 'block-visibility' ),
	},
	{
		value: 'all',
		label: __( 'Is all of the selected', 'block-visibility' ),
	},
	{
		value: 'none',
		label: __( 'Is none of the selected', 'block-visibility' ),
	},
	{
		value: 'noTerms',
		label: __( 'Post has no taxonomy terms', 'block-visibility' ),
	},
];

const anyOperators = [
	{
		value: 'any',
		label: __( 'Is any of the selected', 'block-visibility' ),
	},
	{
		value: 'none',
		label: __( 'Is none of the selected', 'block-visibility' ),
	},
];

const booleanOperators = [
	{
		value: 'equal',
		label: __( 'Is equal to', 'block-visibility' ),
	},
	{
		value: 'notEqual',
		label: __( 'Is not equal to', 'block-visibility' ),
	},
];

const operatorPlaceholder = __( 'Select Condition…', 'block-visibility' );
const selectTypePlaceholder = __( 'Select Type…', 'block-visibility' );
const selectPostsPlaceholder = __( 'Select Posts…', 'block-visibility' );

const archiveHelp = __(
	'Apply this condition to blocks in archive templates.',
	'block-visibility'
);

/**
 * Get all available field groups.
 *
 * @since 3.0.0
 * @return {string} All field groups
 */
export function getFieldGroups() {
	const groups = [
		{
			value: 'type',
			label: __( 'Type', 'block-visibility' ),
		},
		{
			value: 'post',
			label: __( 'Post', 'block-visibility' ),
		},
		{
			value: 'attributes',
			label: __( 'Post Attributes', 'block-visibility' ),
		},
		{
			value: 'archive',
			label: __( 'Archive', 'block-visibility' ),
		},
		{
			value: 'taxonomy',
			label: __( 'Taxonomy Attributes', 'block-visibility' ),
		},
	];

	return groups;
}

/**
 * Get all available fields.
 *
 * @since 3.0.0
 * @return {string} All fields
 */
export function GetAllFields() {
	const postTypes = usePostTypes();
	const taxonomies = useTaxonomies();

	// Create a simple array of public taxonomy slugs.
	const taxonomiesList = useMemo( () => {
		return ( taxonomies ?? [] ).map( ( taxonomy ) => taxonomy.slug );
	}, [ taxonomies ] );

	// Create an array of taxonomies by post type.
	const taxonomiesByPostType = useMemo( () => {
		const data = [];

		postTypes.forEach( ( postType ) => {
			const postTypeTaxonomies = postType?.taxonomies ?? [];

			if ( postTypeTaxonomies.length !== 0 ) {
				const postTypeData = {
					value: postType.value,
					label: postType.label,
					options: [],
				};

				postTypeTaxonomies.forEach( ( taxonomy ) => {
					const taxonomyData = taxonomies.filter(
						( t ) => t.slug === taxonomy
					);

					// Ensure there is taxonomy data.
					if ( taxonomyData.length > 0 ) {
						let label =
							taxonomyData[ 0 ].labels?.singular_name ??
							taxonomyData[ 0 ].name;

						// Many custom post types use Categories and Tags, so
						// append the post type for easier differentiation.
						if (
							( label === 'Category' || label === 'Tag' ) &&
							postType.value !== 'post'
						) {
							label = label + ' ' + '(' + postType.label + ')';
						}

						const options = {
							value: taxonomyData[ 0 ].slug,
							label,
							hierarchical: taxonomyData[ 0 ]?.hierarchical,
						};

						postTypeData.options.push( options );
					}
				} );

				data.push( postTypeData );
			}
		} );

		return data;
	}, [ postTypes ] );

	const hierachicalTaxonomiesByPostType = taxonomiesByPostType.map( function (
		taxonomy
	) {
		const newOptions = taxonomy.options.map( function ( option ) {
			return {
				...option,
				...( option.hierarchical === false && { isDisabled: true } ),
			};
		} );

		return {
			...taxonomy,
			options: newOptions,
		};
	} );

	// Create a simple array of post types.
	const postTypesList = useMemo( () => {
		return ( postTypes ?? [] ).map( ( postType ) => postType.value );
	}, [ postTypes ] );

	// Isolate the post types that are hierarchical.
	const postTypesHierarchical = postTypes.filter(
		( option ) => option?.isHierarchical
	);

	// Create a simple array of post types.
	const postTypesHierarchicalList = useMemo( () => {
		return ( postTypesHierarchical ?? [] ).map(
			( postType ) => postType.value
		);
	}, [ postTypesHierarchical ] );

	// Isolate the post types with archives.
	const postTypesWithArchives = postTypes.filter(
		( option ) => option?.hasArchive
	);

	const fields = [
		{
			value: 'pageType',
			label: __( 'Page Type', 'block-visibility' ),
			group: 'type',
			fields: [
				{
					type: 'operatorField',
					valueType: 'select',
					options: anyOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'multiSelect',
					options: [
						{
							value: 'frontPage',
							label: __(
								'Front Page (Homepage)',
								'block-visibility'
							),
						},
						{
							value: 'postsPage',
							label: __(
								'Posts Page (Blog page)',
								'block-visibility'
							),
						},
						{
							value: 'singular',
							label: __( 'Singular Page', 'block-visibility' ),
						},
						{
							value: 'archive',
							label: __( 'Archive Page', 'block-visibility' ),
						},
						{
							value: 'search',
							label: __(
								'Search Results Page',
								'block-visibility'
							),
						},
						{
							value: '404',
							label: __( '404 Page', 'block-visibility' ),
						},
					],
					placeholder: selectTypePlaceholder,
				},
			],
		},
		{
			value: 'postType',
			label: __( 'Post Type', 'block-visibility' ),
			group: 'post',
			fields: [
				{
					type: 'operatorField',
					valueType: 'select',
					options: anyOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'multiSelect',
					options: postTypes,
					placeholder: selectTypePlaceholder,
					isLoading: postTypes.length === 0,
				},
			],
		},
		{
			value: 'postTaxonomy',
			label: __( 'Post Taxonomy', 'block-visibility' ),
			group: 'post',
			fields: [
				{
					type: 'subField',
					valueType: 'select',
					options: taxonomiesByPostType,
					placeholder: __( 'Select Taxonomy…', 'block-visibility' ),
					hasGroupedOptions: true,
					triggerReset: true,
					isLoading: taxonomiesByPostType.length === 0,
				},
				{
					type: 'operatorField',
					valueType: 'select',
					options: taxonomyOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					conditionalValueTypes: [
						{
							dependencyType: 'subField',
							dependencyValues: taxonomiesList,
							valueTypes: [
								{ value: 'default', valueType: 'termsSelect' },
							],
						},
					],
					displayConditions: [
						{
							dependencyType: 'subField',
							dependencyValues: taxonomiesList,
						},
						{
							dependencyType: 'operatorField',
							dependencyValues: [ 'atLeastOne', 'all', 'none' ],
						},
					],
					placeholder: __( 'Select Terms…', 'block-visibility' ),
				},
			],
		},
		{
			value: 'post',
			label: __( 'Post', 'block-visibility' ),
			group: 'post',
			fields: [
				{
					type: 'subField',
					valueType: 'select',
					options: postTypes,
					placeholder: __( 'Select Post Type…', 'block-visibility' ),
					isLoading: postTypes.length === 0,
					triggerReset: true,
				},
				{
					type: 'operatorField',
					valueType: 'select',
					options: anyOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					conditionalValueTypes: [
						{
							dependencyType: 'subField',
							dependencyValues: postTypesList,
							valueTypes: [
								{ value: 'default', valueType: 'postsSelect' },
							],
						},
					],
					displayConditions: [
						{
							dependencyType: 'subField',
							dependencyValues: postTypesList,
						},
					],
					placeholder: selectPostsPlaceholder,
				},
			],
		},
		{
			value: 'postID',
			label: __( 'Post ID', 'block-visibility' ),
			help: __(
				'For multiple, comma seperate each post ID.',
				'block-visibility'
			),
			group: 'post',
			fields: [
				{
					type: 'operatorField',
					valueType: 'select',
					options: booleanOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'text',
					placeholder: __( 'Enter Post ID…', 'block-visibility' ),
				},
			],
		},
		// Attribute fields
		{
			value: 'attributesAuthor',
			label: __( 'Author', 'block-visibility' ),
			group: 'attributes',
			fields: [
				{
					type: 'operatorField',
					name: 'authorType',
					valueType: 'select',
					options: [
						{
							value: 'any',
							label: __(
								'Is any of the selected',
								'block-visibility'
							),
						},
						{
							value: 'none',
							label: __(
								'Is none of the selected',
								'block-visibility'
							),
						},
						{
							value: 'isCurrentUser',
							label: __(
								'Is the current user',
								'block-visibility'
							),
						},
						{
							value: 'isNotCurrentUser',
							label: __(
								'Is not the current user',
								'block-visibility'
							),
						},
					],
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'authorsSelect',
					placeholder: __( 'Select Author…', 'block-visibility' ),
					displayConditions: [
						{
							dependencyType: 'operatorField',
							dependencyName: 'authorType',
							dependencyValues: [ 'any', 'none' ],
						},
					],
				},
			],
		},
		{
			value: 'attributesThumbnail',
			label: __( 'Featured Image', 'block-visibility' ),
			group: 'attributes',
			fields: [
				{
					type: 'valueField',
					valueType: 'select',
					options: [
						{
							value: 'hasThumbnail',
							label: __(
								'Post has a featured image',
								'block-visibility'
							),
						},
						{
							value: 'noThumbnail',
							label: __(
								'Post has no featured image',
								'block-visibility'
							),
						},
					],
				},
			],
		},
		{
			value: 'attributesExcerpt',
			label: __( 'Excerpt', 'block-visibility' ),
			group: 'attributes',
			fields: [
				{
					type: 'valueField',
					valueType: 'select',
					options: [
						{
							value: 'hasExcerpt',
							label: __(
								'Post has an excerpt',
								'block-visibility'
							),
						},
						{
							value: 'noExcerpt',
							label: __(
								'Post has no excerpt',
								'block-visibility'
							),
						},
					],
				},
			],
		},
		{
			value: 'attributesComments',
			label: __( 'Comments', 'block-visibility' ),
			group: 'attributes',
			fields: [
				{
					type: 'subField',
					valueType: 'select',
					options: [
						{
							value: 'hasComments',
							label: __(
								'Post has comments',
								'block-visibility'
							),
						},
						{
							value: 'noComments',
							label: __(
								'Post has no comments',
								'block-visibility'
							),
						},
						{
							value: 'commentCount',
							label: __(
								'Post comment count',
								'block-visibility'
							),
						},
					],
					placeholder: operatorPlaceholder,
					triggerReset: true,
				},
				{
					type: 'operatorField',
					valueType: 'select',
					options: valueOperators,
					placeholder: operatorPlaceholder,
					displayConditions: [
						{
							dependencyType: 'subField',
							dependencyValues: [ 'commentCount' ],
						},
					],
				},
				{
					type: 'valueField',
					valueType: 'number',
					displayConditions: [
						{
							dependencyType: 'subField',
							dependencyValues: [ 'commentCount' ],
						},
					],
				},
			],
			hasSimplifiedLayout: true,
		},
		{
			value: 'attributesHierarchy',
			label: __( 'Post Hierarchy', 'block-visibility' ),
			group: 'attributes',
			fields: [
				{
					type: 'operatorField',
					valueType: 'select',
					options: [
						{
							value: 'is',
							label: __( 'Post is a', 'block-visibility' ),
						},
						{
							value: 'isNot',
							label: __( 'Post is not a', 'block-visibility' ),
						},
					],
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'select',
					options: [
						{
							value: 'topLevel',
							label: __(
								'Top level post (no parent)',
								'block-visibility'
							),
						},
						{
							value: 'parent',
							label: __(
								'Parent (has children)',
								'block-visibility'
							),
						},
						{
							value: 'child',
							label: __(
								'Child (has parent)',
								'block-visibility'
							),
						},
					],
				},
			],
		},
		{
			value: 'attributesRelativeHierarchy',
			label: __( 'Relative Post Hierarchy', 'block-visibility' ),
			group: 'attributes',
			fields: [
				{
					type: 'subField',
					valueType: 'select',
					options: postTypesHierarchical,
					placeholder: __( 'Select Post Type…', 'block-visibility' ),
					isLoading: postTypesHierarchical.length === 0,
					triggerReset: true,
				},
				{
					type: 'operatorField',
					valueType: 'select',
					options: [
						{
							value: 'parentOf',
							label: __( 'Is a parent of', 'block-visibility' ),
						},
						{
							value: 'notParentOf',
							label: __(
								'Is not a parent of',
								'block-visibility'
							),
						},
						{
							value: 'childOf',
							label: __( 'Is a child of', 'block-visibility' ),
						},
						{
							value: 'notChildOf',
							label: __(
								'Is not a child of',
								'block-visibility'
							),
						},
					],
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					conditionalValueTypes: [
						{
							dependencyType: 'subField',
							dependencyValues: postTypesHierarchicalList,
							valueTypes: [
								{ value: 'default', valueType: 'postSelect' },
							],
						},
					],
					displayConditions: [
						{
							dependencyType: 'subField',
							dependencyValues: postTypesHierarchicalList,
						},
					],
					placeholder: selectPostsPlaceholder,
				},
			],
		},
		{
			value: 'attributesSupports',
			label: __( 'Supports', 'block-visibility' ),
			group: 'attributes',
			fields: [
				{
					type: 'operatorField',
					valueType: 'select',
					options: [
						{
							value: 'supports',
							label: __(
								'Post type supports',
								'block-visibility'
							),
						},
						{
							value: 'notSupport',
							label: __(
								'Post type does not support',
								'block-visibility'
							),
						},
					],
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'select',
					options: [
						{
							value: 'comments',
							label: __( 'Comments', 'block-visibility' ),
						},
						{
							value: 'excerpt',
							label: __( 'Excerpts', 'block-visibility' ),
						},
						{
							value: 'thumbnail',
							label: __(
								'Featured Images (Thumbnail)',
								'block-visibility'
							),
						},
						{
							value: 'hierarchical',
							label: __( 'Post Hierarchy', 'block-visibility' ),
						},
					],
				},
			],
		},
		// Archive fields
		{
			value: 'archiveType',
			label: __( 'Archive Type', 'block-visibility' ),
			help: archiveHelp,
			group: 'archive',
			fields: [
				{
					type: 'operatorField',
					valueType: 'select',
					options: anyOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'multiSelect',
					options: [
						{
							value: 'postTypes',
							label: __( 'Post Types', 'block-visibility' ),
							options: postTypesWithArchives,
						},
						...taxonomiesByPostType,
						{
							value: 'internal',
							label: __( 'Internal', 'block-visibility' ),
							options: [
								{
									value: 'author',
									label: __( 'Author', 'block-visibility' ),
								},
								{
									value: 'date',
									label: __( 'Date', 'block-visibility' ),
								},
							],
						},
					],
					placeholder: selectTypePlaceholder,
					hasGroupedOptions: true,
					isLoading:
						taxonomiesByPostType.length === 0 ||
						postTypesWithArchives.length === 0,
				},
			],
		},
		{
			value: 'archive',
			label: __( 'Archive', 'block-visibility' ),
			help: archiveHelp,
			group: 'archive',
			fields: [
				{
					type: 'subField',
					valueType: 'select',
					options: [
						...taxonomiesByPostType,
						{
							value: 'internal',
							label: __( 'Internal', 'block-visibility' ),
							options: [
								{
									value: 'author',
									label: __( 'Author', 'block-visibility' ),
								},
							],
						},
					],
					placeholder: selectTypePlaceholder,
					hasGroupedOptions: true,
					isLoading: taxonomiesByPostType.length === 0,
					triggerReset: true,
				},
				{
					type: 'operatorField',
					valueType: 'select',
					options: anyOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					conditionalValueTypes: [
						{
							dependencyType: 'subField',
							dependencyValues: [ 'author', ...taxonomiesList ],
							valueTypes: [
								{ value: 'author', valueType: 'authorsSelect' },
								{ value: 'default', valueType: 'termsSelect' },
							],
						},
					],
					displayConditions: [
						{
							dependencyType: 'subField',
							dependencyValues: [ 'author', ...taxonomiesList ],
						},
					],
					placeholder: __( 'Select Value…', 'block-visibility' ),
				},
			],
		},
		// Taxonomy attribute fields
		{
			value: 'taxonomyTermHierarchy',
			label: __( 'Term Hierarchy', 'block-visibility' ),
			help: archiveHelp,
			group: 'taxonomy',
			fields: [
				{
					type: 'operatorField',
					valueType: 'select',
					options: [
						{
							value: 'is',
							label: __( 'Term is a', 'block-visibility' ),
						},
						{
							value: 'isNot',
							label: __( 'Term is not a', 'block-visibility' ),
						},
					],
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'select',
					options: [
						{
							value: 'topLevel',
							label: __(
								'Top level term (no parent)',
								'block-visibility'
							),
						},
						{
							value: 'parent',
							label: __(
								'Parent (has children)',
								'block-visibility'
							),
						},
						{
							value: 'child',
							label: __(
								'Child (has parent)',
								'block-visibility'
							),
						},
					],
				},
			],
		},
		{
			value: 'taxonomyTermRelativeHierarchy',
			label: __( 'Relative Term Hierarchy', 'block-visibility' ),
			help: archiveHelp,
			group: 'taxonomy',
			fields: [
				{
					type: 'subField',
					valueType: 'select',
					options: hierachicalTaxonomiesByPostType,
					placeholder: __(
						'Select Taxonomy Type…',
						'block-visibility'
					),
					hasGroupedOptions: true,
					isLoading: hierachicalTaxonomiesByPostType.length === 0,
					triggerReset: true,
				},
				{
					type: 'operatorField',
					valueType: 'select',
					options: [
						{
							value: 'parentOf',
							label: __( 'Is a parent of', 'block-visibility' ),
						},
						{
							value: 'notParentOf',
							label: __(
								'Is not a parent of',
								'block-visibility'
							),
						},
						{
							value: 'childOf',
							label: __( 'Is a child of', 'block-visibility' ),
						},
						{
							value: 'notChildOf',
							label: __(
								'Is not a child of',
								'block-visibility'
							),
						},
					],
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					conditionalValueTypes: [
						{
							dependencyType: 'subField',
							dependencyValues: taxonomiesList,
							valueTypes: [
								{ value: 'default', valueType: 'termSelect' },
							],
						},
					],
					displayConditions: [
						{
							dependencyType: 'subField',
							dependencyValues: taxonomiesList,
						},
					],
					placeholder: selectPostsPlaceholder,
				},
			],
		},
		{
			value: 'taxonomySupports',
			label: __( 'Supports', 'block-visibility' ),
			help: archiveHelp,
			group: 'taxonomy',
			fields: [
				{
					type: 'operatorField',
					valueType: 'select',
					options: [
						{
							value: 'supports',
							label: __(
								'Taxonomy supports',
								'block-visibility'
							),
						},
						{
							value: 'notSupport',
							label: __(
								'Taxonomy does not support',
								'block-visibility'
							),
						},
					],
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'select',
					options: [
						{
							value: 'hierarchical',
							label: __( 'Term Hierarchy', 'block-visibility' ),
						},
					],
				},
			],
		},
	];

	return fields;
}

/**
 * Get all perpared fields. This takes the available fields and puts them in the
 * proper field groups.
 *
 * @since 3.0.0
 * @return {string} All fields perpared in their respective field groups
 */
export function getGroupedFields() {
	return prepareGroupedFields( getFieldGroups(), GetAllFields() );
}
