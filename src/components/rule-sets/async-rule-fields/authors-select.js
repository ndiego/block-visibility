/**
 * External dependencies
 */
import Select from 'react-select';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Module Constants
 */
const DEFAULT_QUERY = {
	context: 'view', // Allows non-admins to perform requests.
	orderby: 'name',
	order: 'asc',
	per_page: -1,
	who: 'authors',
	_fields: 'id,name',
};

/**
 * Render an authors select field.
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function AuthorsSelect( props ) {
	const {
		className,
		fieldType,
		fieldName,
		handleRuleChange,
		triggerReset,
		value,
	} = props;

	const { authors, loading } = useSelect( ( select ) => {
		const { getUsers, isResolving } = select( 'core' );
		return {
			authors: getUsers( DEFAULT_QUERY ),
			loading: isResolving( 'getUsers', [ DEFAULT_QUERY ] ),
		};
	}, [] );

	const authorOptions = useMemo( () => {
		return ( authors ?? [] ).map( ( author ) => {
			return {
				value: author.id,
				label: decodeEntities( author.name ),
			};
		} );
	}, [ authors ] );

	const selectedAuthors = authorOptions.filter( ( author ) =>
		value.includes( author.value )
	);

	return (
		<Select
			className={ classnames(
				'block-visibility__react-select',
				className
			) }
			classNamePrefix="react-select"
			value={ selectedAuthors }
			options={ authorOptions }
			placeholder={ __( 'Select Author…', 'block-visibility' ) }
			onChange={ ( values ) =>
				handleRuleChange(
					values,
					'multiSelect', // Need for value handling.
					fieldType,
					fieldName,
					triggerReset
				)
			}
			isLoading={ loading }
			isMulti
		/>
	);
}
