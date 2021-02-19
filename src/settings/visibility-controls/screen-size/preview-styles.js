/**
 * External dependencies
 */
import { trim } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';

/**
 * Renders a preview of the screen size CSS rendered on the frontend.
 *
 * @since 1.5.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function PreviewStyles( props ) {
	const [ preview, setPreview ] = useState( false );
	const { screenSize, enableAdvancedControls } = props;
	const defaultStyles = getDefaultStyles( screenSize );
	const advancedStyles = getAdvancedStyles( screenSize );

	return (
		<div className="breakpoint-css-preview">
			<Button onClick={ () => setPreview( ! preview ) } isSecondary>
				{ [
					! preview &&
						__( 'Preview Frontend CSS', 'block-visibility' ),
					preview && __( 'Hide Preview', 'block-visibility' ),
				] }
			</Button>
			{ preview && (
				<pre>
					{ [
						enableAdvancedControls && advancedStyles,
						! enableAdvancedControls && defaultStyles,
					] }
				</pre>
			) }
		</div>
	);
}

/**
 * Generate the default styles
 *
 * @since 1.5.0
 * @param {Object} screenSize All the screen size settings
 * @return {string}		      Return the default styles
 */
function getDefaultStyles( screenSize ) {
	// Breakpoints.
	const large = screenSize.breakpoints.large;
	const medium = screenSize.breakpoints.medium;

	// Screen size controls.
	const largeEnabled = screenSize.controls.large;
	const mediumEnabled = screenSize.controls.medium;
	const smallEnabled = screenSize.controls.small;

	const spacer = `

`;

	let styles = '';

	/* eslint-disable */
	if ( largeEnabled ) {
		styles = `/* Large screens (desktops, ${ large } and up) */
@media ( min-width: ${ large } ) {
	.block-visibility-hide-large-screen {
		display: none !important;
	}
}`;
	}

	if ( mediumEnabled ) {
		const prevStyles = styles ? styles + spacer : styles;
		styles = prevStyles + `/* Medium screens (tablets, between ${ medium } and ${ large }) */
@media ( min-width: ${ medium } ) and ( max-width: ${ setMaxWidth( large ) } ) {
	.block-visibility-hide-medium-screen {
		display: none !important;
	}
}`;
	}

	if ( smallEnabled ) {
		const prevStyles = styles ? styles + spacer : styles;
		styles = prevStyles + `/* Small screens (mobile devices, less than ${ medium }) */
@media ( max-width: ${ setMaxWidth( medium ) } ) {
	.block-visibility-hide-small-screen {
		display: none !important;
	}
}`;
	}
	/* eslint-enable */

	if ( ! styles ) {
		styles = `/* All screen size controls have been disabled. */`;
	}

	return styles;
}

/**
 * Generate the advanced styles
 *
 * @since 1.5.0
 * @param {Object} screenSize All the screen size settings
 * @return {string}		      Return the advanced styles
 */
function getAdvancedStyles( screenSize ) {
	// Breakpoints.
	const extraLarge = screenSize.breakpoints.extra_large;
	const large = screenSize.breakpoints.large;
	const medium = screenSize.breakpoints.medium;
	const small = screenSize.breakpoints.small;

	// Screen size controls.
	const extraLargeEnabled = screenSize.controls.extra_large;
	const largeEnabled = screenSize.controls.large;
	const mediumEnabled = screenSize.controls.medium;
	const smallEnabled = screenSize.controls.small;
	const extraSmallEnabled = screenSize.controls.extra_small;

	const spacer = `

`;

	let styles = '';

	/* eslint-disable */
	if ( extraLargeEnabled ) {
		styles = `/* Extra large screens (large desktops, ${ extraLarge } and up) */
@media ( min-width: ${ extraLarge } ) {
	.block-visibility-hide-extra-large-screen {
		display: none !important;
	}
}`;
	}

	if ( largeEnabled ) {
		const prevStyles = styles ? styles + spacer : styles;
		styles = prevStyles + `/* Large screens (desktops, between ${ large } and ${ extraLarge }) */
@media ( min-width: ${ large } ) and (max-width: ${ setMaxWidth( extraLarge ) } ) {
	.block-visibility-hide-large-screen {
		display: none !important;
	}
}`;
	}

	if ( mediumEnabled ) {
		const prevStyles = styles ? styles + spacer : styles;
		styles = prevStyles + `/* Medium screens (tablets, between ${ medium } and ${ large }) */
@media ( min-width: ${ medium } ) and ( max-width: ${ setMaxWidth( large ) } ) {
	.block-visibility-hide-medium-screen {
		display: none !important;
	}
}`;
	}

	if ( smallEnabled ) {
		const prevStyles = styles ? styles + spacer : styles;
		styles = prevStyles + `/* Small screens (landscape mobile devices, between ${ small } and ${ large }) */
@media ( min-width: ${ small } ) and ( max-width: ${ setMaxWidth( medium ) } ) {
	.block-visibility-hide-small-screen {
		display: none !important;
	}
}`;
	}

	if ( extraSmallEnabled ) {
		const prevStyles = styles ? styles + spacer : styles;
		styles = prevStyles + `/* Extra small screens (portrait mobile devices, less than ${ small }) */
@media ( max-width: ${ setMaxWidth( small ) } ) {
	.block-visibility-hide-extra-small-screen {
		display: none !important;
	}
}`;
	}
	/* eslint-enable */

	if ( ! styles ) {
		styles = `/* All screen size controls have been disabled. */`;
	}

	return styles;
}

/**
 * Takes a given width string and subracts 0.02. The width string includes 'px'
 * so need to remove that first to do calculation, then add it back.
 *
 * @since 1.5.0
 * @param {string} width A given width string
 * @return {string}		 The width string minus 0.02
 */
function setMaxWidth( width ) {
	const maxWidth = trim( width, 'px' ) - 0.02;
	return maxWidth + 'px';
}
