/**
 * External dependencies
 */
import Select from 'react-select';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Module Constants
 */
const DEFAULT_QUERY = {
	context: 'view',
	orderby: 'name',
	order: 'asc',
	per_page: -1,
	_fields: 'id,name',
};

/**
 * Render a terms select field.
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 */
export default function TermsSelect( props ) {
	const {
		className,
		fieldType,
		fieldName,
		handleRuleChange,
		placeholder,
		taxonomySlug,
		triggerReset,
		value,
	} = props;

	const { availableTerms, loading } = useSelect(
		( select ) => {
			const { getEntityRecords, isResolving } = select( 'core' );
			return {
				availableTerms: getEntityRecords(
					'taxonomy',
					taxonomySlug,
					DEFAULT_QUERY
				),
				loading: isResolving( 'getEntityRecords', [
					'taxonomy',
					taxonomySlug,
					DEFAULT_QUERY,
				] ),
			};
		},
		[ taxonomySlug ]
	);

	const termsOptions = useMemo( () => {
		return ( availableTerms ?? [] ).map( ( term ) => {
			return {
				value: term.id,
				label: decodeEntities( term.name ),
			};
		} );
	}, [ availableTerms ] );

	const selectedTerms = termsOptions.filter( ( term ) =>
		value.includes( term.value )
	);

	return (
		<Select
			className={ classnames(
				'block-visibility__react-select',
				className
			) }
			classNamePrefix="react-select"
			value={ selectedTerms }
			options={ termsOptions }
			placeholder={ placeholder }
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
