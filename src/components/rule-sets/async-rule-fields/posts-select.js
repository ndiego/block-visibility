/**
 * External dependencies
 */
import { get, debounce } from 'lodash';
import Select from 'react-select';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useState, useMemo } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Internal dependencies
 */
import { ClearIndicator, DropdownIndicator, IndicatorSeparator, MultiValueRemove } from '../../../utils/react-select-utils';

/**
 * Format a post title and conditionally prefix with statuses.
 *
 * @since 3.0.0
 * @param {Object} post The post object.
 * @return {string}	    Return the formatted post title.
 */
function getTitle( post ) {
	const title = post?.title?.raw
		? decodeEntities( post.title.rendered )
		: `${ __( 'Untitled', 'block-visibility' ) } #${ post.id }`;

	let status = '';

	// Prefix a status for draft and pending posts. WordPress does this
	// automatically for Private posts.
	if ( post?.status === 'draft' || post?.status === 'pending' ) {
		status = `${
			post.status.charAt( 0 ).toUpperCase() + post.status.slice( 1 )
		}: `;
	}

	return status + title;
}

/**
 * Render a posts select field.
 * Inspired by: https://github.com/WordPress/gutenberg/blob/trunk/packages/editor/src/components/page-attributes/parent.js
 *
 * @since 1.6.0
 * @param {Object} props All the props passed to this function
 */
export default function PostsSelect( props ) {
	const {
		className,
		fieldId,
		fieldType,
		fieldName,
		handleRuleChange,
		label,
		placeholder,
		help,
		postType,
		triggerReset,
		value,
		valueType,
		isMulti,
	} = props;
	const [ selectedValues, setSelectedValues ] = useState( false );
	const [ searchValue, setSearchValue ] = useState( false );

	const { availablePosts, loadingAvailablePosts } = useSelect(
		( select ) => {
			const { getPostType, getEntityRecords, isResolving } =
				select( 'core' );

			// Change the way each post type is displayed depending on
			// whether it is hierarchical or not. This mirrors the WP admin.
			const postTypeObject = getPostType( postType );
			const isHierarchical = get(
				postTypeObject,
				[ 'hierarchical' ],
				false
			);

			const query = {
				orderby: isHierarchical ? 'title' : 'date',
				order: isHierarchical ? 'asc' : 'desc',
				per_page: 25,
				status: 'publish,draft,private,pending',
				_fields: 'id,title,status',
			};

			// Perform a search when the user inputs a value.
			if ( !! searchValue ) {
				query.search = searchValue;
			}

			return {
				availablePosts: getEntityRecords( 'postType', postType, query ),
				loadingAvailablePosts: isResolving( 'getEntityRecords', [
					'postType',
					postType,
					query,
				] ),
			};
		},
		[ searchValue ]
	);

	// When first rendering the select field, if there are saved values,
	// we need to fetch them directly. Saved values will likely not be
	// in the default availablePosts array.
	const { savedPosts, loadingSavedPosts } = useSelect( ( select ) => {
		// Only fetch data if there are saved values and no
		// selected values. Otherwise return an empty array.
		if ( value.length !== 0 && ! selectedValues ) {
			const selectedQuery = {
				include: Array.isArray( value ) ? value.join( ',' ) : value,
				per_page: -1,
				status: 'publish,draft,private,pending',
				_fields: 'id,title,status',
			};
			const { getEntityRecords, isResolving } = select( 'core' );

			return {
				savedPosts: getEntityRecords(
					'postType',
					postType,
					selectedQuery
				),
				selectedLoading: isResolving( 'getEntityRecords', [
					'postType',
					postType,
					selectedQuery,
				] ),
			};
		}

		return {
			savedPosts: [],
			loadingSavedPosts: false,
		};
	} );

	const postsOptions = useMemo( () => {
		return ( availablePosts ?? [] ).map( ( post ) => {
			return {
				value: post.id,
				label: getTitle( post ),
			};
		} );
	}, [ availablePosts ] );

	let postsSelected = [];

	// If there are no selected values, display the saved values
	// if there are any.
	if ( ! selectedValues ) {
		postsSelected = ( savedPosts ?? [] ).map( ( post ) => {
			return {
				value: post.id,
				label: getTitle( post ),
			};
		} );
	} else {
		postsSelected = selectedValues;
	}

	const handleChange = ( values ) => {
		// Need for value handling.
		const valueHandling =
			valueType === 'postSelect' ? 'select' : 'multiSelect';

		setSelectedValues( values );
		handleRuleChange(
			values,
			valueHandling,
			fieldType,
			fieldName,
			triggerReset
		);
	};

	const handleInputChange = ( input ) => {
		if ( input.length === 0 || input.length >= 3 ) {
			setSearchValue( input );
		}
	};

	// Only display options if there is no search input or the user
	// has entered more than 3 characters. We don't care what the
	// option actually is.
	const filterOption = ( option, input ) => {
		return input.length === 0 || input.length >= 3;
	};

	// If there are no options, display different messages depending
	// on the search inputs.
	const noOptionsMessage = ( input ) => {
		const inputLength = input?.inputValue.length ?? 0;
		return inputLength === 0 || inputLength >= 3
			? __( 'No options found', 'block-visibility' )
			: __( 'Enter 3 characters to begin search', 'block-visibility' );
	};

	return (
		<>
			{ label && (
				<label
					id={ `${ fieldId }_label` }
					htmlFor={ `${ fieldId }_select` }
					className="field__label"
				>
					{ label }
				</label>
			) }
			<Select
				aria-labelledby={ `${ fieldId }` }
				components={ { ClearIndicator, DropdownIndicator, IndicatorSeparator, MultiValueRemove } }
				inputId={ `${ fieldId }_select` }
				className={ classnames(
					'block-visibility__react-select',
					className
				) }
				classNamePrefix="react-select"
				value={ postsSelected }
				options={ postsOptions }
				onChange={ handleChange }
				onInputChange={ debounce( handleInputChange, 300 ) }
				filterOption={ filterOption }
				noOptionsMessage={ noOptionsMessage }
				placeholder={ placeholder }
				isLoading={ loadingAvailablePosts || loadingSavedPosts }
				isMulti={ isMulti }
			/>
			{ help && (
				<div className="control-fields-item__help for-select-component">
					{ help }
				</div>
			) }
		</>
	);
}
