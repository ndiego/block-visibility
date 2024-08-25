/**
 * External dependencies
 */
import Select from 'react-select';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useEntityRecords } from '@wordpress/core-data';
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
		fieldId,
		fieldType,
		fieldName,
		handleRuleChange,
		label,
		placeholder,
		help,
		taxonomySlug,
		triggerReset,
		value,
		isMulti,
	} = props;

	const availableTerms = useEntityRecords(
		'taxonomy',
		taxonomySlug,
		DEFAULT_QUERY
	);

	const termsOptions = useMemo( () => {
		return ( availableTerms.records ?? [] ).map( ( term ) => {
			return {
				value: term.id,
				label: decodeEntities( term.name ),
			};
		} );
	}, [ availableTerms.records ] );

	const selectedTerms = termsOptions.filter( ( term ) => {
		return isMulti ? value.includes( term.value ) : value === term.value;
	} );

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
				inputId={ `${ fieldId }_select` }
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
						isMulti ? 'multiSelect' : 'select', // Need for value handling.
						fieldType,
						fieldName,
						triggerReset
					)
				}
				isLoading={ availableTerms.isResolving }
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
