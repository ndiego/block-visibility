/**
 * External dependencies
 */
import { isInteger } from 'lodash';
import moment from 'moment';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, ButtonGroup } from '@wordpress/components';
import { createElement, useState, useMemo } from '@wordpress/element';

/**
 * Module Constants
 */
const DATELESS_TIMEZONELESS_FORMAT = 'HH:mm:ss';

/**
 * A shared component to parse, validate, and handle remounting of the underlying input field.
 * Code borrow heavily from: https://github.com/WordPress/gutenberg/blob/trunk/packages/components/src/date-time/time.js
 *
 * @since 3.0.0
 * @param {Object}        props          Component props.
 * @param {number|string} props.value    The default value of the component which will be parsed to integer.
 * @param {Function}      props.onUpdate Call back when blurred and validated.
 */
function UpdateOnBlurAsIntegerInput( { value, onUpdate, ...props } ) {
	function handleBlur( event ) {
		const { target } = event;

		if ( value === target.value ) {
			return;
		}

		const parsedValue = parseInt( target.value, 10 );

		// Run basic number validation on the input.
		if (
			! isInteger( parsedValue ) ||
			( typeof props.max !== 'undefined' && parsedValue > props.max ) ||
			( typeof props.min !== 'undefined' && parsedValue < props.min )
		) {
			// If validation failed, reset the value to the previous valid value.
			target.value = value;
		} else {
			// Otherwise, it's valid, call onUpdate.
			onUpdate( target.name, parsedValue );
		}
	}

	return createElement( 'input', {
		// Re-mount the input value to accept the latest value as the defaultValue.
		key: value,
		defaultValue: value,
		onBlur: handleBlur,
		...props,
	} );
}

/**
 * Get the starting date/time value.
 *
 * @since 3.0.0
 * @param {string} currentTime The current time string
 * @return {Object}		       Return the full date/time object for the provided current time string
 */
function startingValue( currentTime ) {
	const defaultTime = '1970-01-01T00:00:00';

	let setTime = currentTime ? '1970-01-01T' + currentTime : defaultTime;

	// Make sure our set time is an actual date/time.
	if ( ! moment( setTime, 'YYYY-MM-DDTHH:mm:ss', true ).isValid() ) {
		setTime = defaultTime;
	}

	return moment( setTime ).startOf( 'minutes' );
}

/**
 * Render the time picker field.
 * Code borrow heavily from: https://github.com/WordPress/gutenberg/blob/trunk/packages/components/src/date-time/time.js
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 */
export default function TimePicker( props ) {
	const { label, currentTime, is12Hour, onChange } = props;
	const startingTime = startingValue( currentTime );

	// We don't care about the date, but need a date for moment.js
	const [ date, setDate ] = useState( startingTime );

	const { minutes, hours, am } = useMemo(
		() => ( {
			minutes: startingTime.format( 'mm' ),
			hours: startingTime.format( is12Hour ? 'hh' : 'HH' ),
			am: startingTime.format( 'H' ) <= 11 ? 'AM' : 'PM',
		} ),
		[ startingTime, is12Hour ]
	);

	/**
	 * Function that sets the date state and calls the onChange with a new date.
	 * The date is truncated at the minutes.
	 *
	 * @param {Object} newDate The date object.
	 */
	function changeDate( newDate ) {
		setDate( newDate );
		let formatedDate = newDate.format( DATELESS_TIMEZONELESS_FORMAT );

		// We assume if the user set the datetime to '23:59:00' they want the
		// time to go to midnight. There is no seconds option so add 59 seconds.
		formatedDate = formatedDate === '23:59:00' ? '23:59:59' : formatedDate;

		onChange( formatedDate );
	}

	function update( name, value ) {
		let newValue = value;

		// Respect the current AM or PM setting when changing the hours value.
		if ( is12Hour && name === 'hours' && am === 'PM' ) {
			newValue = newValue !== 12 ? value + 12 : newValue;
		}

		// Clone the date and call the specific setter function according to `name`.
		const newDate = date.clone()[ name ]( newValue );
		changeDate( newDate );
	}

	function updateAmPm( value ) {
		return () => {
			if ( am === value ) {
				return;
			}

			const parsedHours = parseInt( hours, 10 );

			const newDate = date
				.clone()
				.hours(
					value === 'PM'
						? ( ( parsedHours % 12 ) + 12 ) % 24
						: parsedHours % 12
				);

			changeDate( newDate );
		};
	}

	return (
		<fieldset className="time-picker">
			{ label && (
				<span className="control-fields-item__sub-label">
					{ label }
				</span>
			) }
			<div className="time-picker__fields-wrapper">
				<div className="time-picker__fields-inputs">
					<UpdateOnBlurAsIntegerInput
						aria-label={ __( 'Hours', 'block-visibility' ) }
						type="number"
						name="hours"
						step={ 1 }
						min={ is12Hour ? 1 : 0 }
						max={ is12Hour ? 12 : 23 }
						value={ hours }
						onUpdate={ update }
					/>
					<span aria-hidden="true">:</span>
					<UpdateOnBlurAsIntegerInput
						aria-label={ __( 'Minutes', 'block-visibility' ) }
						type="number"
						name="minutes"
						step={ 1 }
						min={ 0 }
						max={ 59 }
						value={ minutes }
						onUpdate={ update }
					/>
				</div>
				{ is12Hour && (
					<ButtonGroup className="time-picker__fields-am-pm">
						<Button
							isPrimary={ am === 'AM' }
							isSecondary={ am !== 'AM' }
							onClick={ updateAmPm( 'AM' ) }
							className="time-picker__am-button"
						>
							{ __( 'AM', 'block-visibility' ) }
						</Button>
						<Button
							isPrimary={ am === 'PM' }
							isSecondary={ am !== 'PM' }
							onClick={ updateAmPm( 'PM' ) }
							className="time-picker__pm-button"
						>
							{ __( 'PM', 'block-visibility' ) }
						</Button>
					</ButtonGroup>
				) }
			</div>
		</fieldset>
	);
}
