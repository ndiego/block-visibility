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
export default function CSSPreview( props ) {
	const [ preview, setPreview ] = useState( false );
	const { screenSize, enableAdvancedControls } = props;

	// The width includes 'px' so need to remove to do calculation.
	function setMaxWidth( width ) {
		const maxWidth = trim( width, 'px' ) - 0.02;
		return maxWidth + 'px';
	}

	/* eslint-disable */
	const defaultCSS = `// Large devices (desktops, ${ screenSize.breakpoints.large } and up)
@media ( min-width: ${ screenSize.breakpoints.large } ) {
	.block-visibility-hide-screen-large {
		display: none !important;
	}
}

// Medium devices (tablets, ${ screenSize.breakpoints.medium } and up)
@media ( min-width: ${ screenSize.breakpoints.medium } ) and ( max-width: ${ setMaxWidth( screenSize.breakpoints.large ) } ) {
	.block-visibility-hide-screen-medium {
		display: none !important;
	}
}

// Small devices (mobile devices, less than ${ setMaxWidth( screenSize.breakpoints.medium ) })
@media ( max-width: ${ setMaxWidth( screenSize.breakpoints.medium ) } ) {
	.block-visibility-hide-screen-small {
		display: none !important;
	}
}`;

	const advancedCSS = `// Extra large devices (large desktops, ${ screenSize.breakpoints.extra_large } and up)
@media ( min-width: ${ screenSize.breakpoints.extra_large } ) {
	.block-visibility-hide-screen-extra-large {
		display: none !important;
	}
}

// Large devices (desktops, ${ screenSize.breakpoints.large } and up)
@media ( min-width: ${ screenSize.breakpoints.large } ) and (max-width: ${ setMaxWidth( screenSize.breakpoints.extra_large ) } ) {
	.block-visibility-hide-screen-large {
		display: none !important;
	}
}

// Medium devices (tablets, ${ screenSize.breakpoints.medium } and up)
@media ( min-width: ${ screenSize.breakpoints.medium } ) and ( max-width: ${ setMaxWidth( screenSize.breakpoints.large ) } ) {
	.block-visibility-hide-screen-medium {
		display: none !important;
	}
}

// Small devices (landscape phones, ${ screenSize.breakpoints.small } and up)
@media ( min-width: ${ screenSize.breakpoints.small } ) and ( max-width: ${ setMaxWidth( screenSize.breakpoints.medium ) } ) {
	.block-visibility-hide-screen-small {
		display: none !important;
	}
}

// Extra small devices (portrait phones, less than ${ setMaxWidth( screenSize.breakpoints.small ) })
@media ( max-width: ${ setMaxWidth( screenSize.breakpoints.small ) } ) {
	.block-visibility-hide-screen-extra-small {
		display: none !important;
	}
}`;
	/* eslint-enable */

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
						enableAdvancedControls && advancedCSS,
						! enableAdvancedControls && defaultCSS,
					] }
				</pre>
			) }
		</div>
	);
}
