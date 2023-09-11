/**
 * External dependencies
 */
import { debounce } from 'lodash';
import Select from 'react-select';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState, useMemo } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

/**
 * Render an products select field.
 *
 * @since 3.1.0
 * @param {Object} props All the props passed to this function
 */
export default function WooProductsSelect( props ) {
	const {
		className,
		fieldType,
		fieldName,
		handleRuleChange,
		placeholder,
		triggerReset,
		value,
		valueType,
		isMulti,
	} = props;

	const [ availableProducts, setAvailableProducts ] = useState( [] );
	const [ savedProducts, setSavedProducts ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ selectedValues, setSelectedValues ] = useState( [] );
	const [ searchValue, setSearchValue ] = useState( undefined );

	// Fetch any saved products on mount.
	useEffect( () => {
		// Only fetched saved products if there are no selected values
		if ( value.length !== 0 && selectedValues.length === 0 ) {
			const path = addQueryArgs( '/block-visibility/v1/variables', {
				integration: 'woocommerce',
				saved_values: Array.isArray( value )
					? value.join( ',' )
					: value,
			} );

			setIsLoading( true );

			apiFetch( { path } )
				.then( ( response ) => {
					const fetchedProducts =
						response?.integrations?.woocommerce?.products ?? [];

					// If a product variation is on of the saved values, the fetch will return the
					// main product and all associated variations. So we need to strip out all
					// products that are not actually part of the saved values.
					const saved = fetchedProducts.filter( ( product ) => {
						if ( Array.isArray( value ) ) {
							return value.includes( product.value );
						}

						return value === product.value;
					} );

					setSavedProducts( saved );
					setIsLoading( false );
				} )
				.catch( () => {
					// Fail by setting no saved products.
					setSavedProducts( [] );
					setIsLoading( false );
				} );
		}
	}, [] );

	// Fetch the available products for the select dropdown on mount, and then whenever
	// a search is preformed.
	useEffect( () => {
		const path = addQueryArgs( '/block-visibility/v1/variables', {
			integration: 'woocommerce',
			search_term: searchValue ?? undefined,
		} );

		setIsLoading( true );

		apiFetch( { path } )
			.then( ( response ) => {
				setAvailableProducts(
					response?.integrations?.woocommerce?.products ?? []
				);
				setIsLoading( false );
			} )
			.catch( () => {
				// Fail by returning no results.
				setAvailableProducts( [] );
				setIsLoading( false );
			} );
	}, [ searchValue ] );

	const options = useMemo( () => {
		return availableProducts;
	}, [ availableProducts ] );

	let selected = [];

	// If there are no selected values, display the saved values
	// if there are any.
	if ( selectedValues.length === 0 ) {
		selected = savedProducts;
	} else {
		selected = selectedValues;
	}

	const handleChange = ( values ) => {
		// Need for value handling.
		const valueHandling =
			valueType === 'wooProductSelect' ? 'select' : 'multiSelect';

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
			? __( 'No products found', 'block-visibility' )
			: __( 'Enter 3 characters to begin search', 'block-visibility' );
	};

	return (
		<Select
			className={ classnames(
				'block-visibility__react-select',
				className
			) }
			classNamePrefix="react-select"
			value={ selected }
			options={ options }
			onChange={ handleChange }
			onInputChange={ debounce( handleInputChange, 300 ) }
			filterOption={ filterOption }
			noOptionsMessage={ noOptionsMessage }
			placeholder={ placeholder }
			isLoading={ isLoading }
			isMulti={ isMulti }
		/>
	);
}
