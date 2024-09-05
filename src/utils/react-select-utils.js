/**
 * External dependencies
 */
import { components } from 'react-select';

/**
 * Internal dependencies
 */
import { chevronDown, close } from './icons';

export const IndicatorSeparator = () => {
	return null;
};

export const DropdownIndicator = props => {
	return (
		<components.DropdownIndicator {...props}>
			{ chevronDown }
		</components.DropdownIndicator>
	);
};

export const ClearIndicator = props => {
	return (
		<components.ClearIndicator {...props}>
			{ close }
		</components.ClearIndicator>
	);
};

export const MultiValueRemove = props => {
	return (
		<components.MultiValueRemove {...props}>
			{ close }
		</components.MultiValueRemove>
	);
};