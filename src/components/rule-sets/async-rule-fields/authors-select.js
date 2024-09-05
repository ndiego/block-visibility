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
 * Internal dependencies
 */
import {
	ClearIndicator,
	DropdownIndicator,
	IndicatorSeparator,
	MultiValueRemove,
} from '../../../utils/react-select-utils';

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
 */
export default function AuthorsSelect( props ) {
	const {
		className,
		fieldId,
		fieldType,
		fieldName,
		handleRuleChange,
		triggerReset,
		value,
		label,
		help,
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
				components={ {
					ClearIndicator,
					DropdownIndicator,
					IndicatorSeparator,
					MultiValueRemove,
				} }
				inputId={ `${ fieldId }_select` }
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
			{ help && (
				<div className="control-fields-item__help for-select-component">
					{ help }
				</div>
			) }
		</>
	);
}
