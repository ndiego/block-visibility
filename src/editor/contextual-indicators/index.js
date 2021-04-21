/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import hasDateTime from './has-date-time';
import hasUserRole from './has-user-role';
import hasScreenSize from './has-screen-size';
import hasQueryString from './has-query-string';
import hasACF from './has-acf';
import hasWPFusion from './has-wp-fusion';
import hasVisibilityControls from './../utils/has-visibility-controls';
import usePluginData from './../utils/use-plugin-data';
import { isPluginSettingEnabled } from './../utils/setting-utilities';
import getEnabledControls from './../../utils/get-enabled-controls';

/**
 * Filter each block and add CSS classes based on visibility settings.
 *
 * @since 1.1.0
 * @param {Object} BlockListBlock
 */
function withContextualIndicators( BlockListBlock ) {
	return ( props ) => {
		const settings = usePluginData( 'settings' );
		const variables = usePluginData( 'variables' );

		if ( settings === 'fetching' ) {
			return <BlockListBlock { ...props } />;
		}

		const { name, attributes } = props;
		const enableIndicators = isPluginSettingEnabled(
			settings,
			'enable_contextual_indicators'
		);
		const hasVisibility = hasVisibilityControls( settings, name );
		const enabledControls = getEnabledControls( settings, variables );

		if (
			! enableIndicators ||
			! hasVisibility ||
			enabledControls.length === 0
		) {
			return <BlockListBlock { ...props } />;
		}

		const { blockVisibility } = attributes;
		const hideBlock = blockVisibility?.hideBlock ?? false;
		const isHidden =
			hideBlock &&
			enabledControls.some(
				( control ) => control.settingSlug === 'hide_block'
			);

		const hasControlSets = blockVisibility?.controlSets ?? false;
		let controls = blockVisibility ?? {};

		if ( hasControlSets ) {
			// The control set array is empty or the default set has no applied controls.
			if (
				blockVisibility.controlSets.length !== 0 &&
				blockVisibility.controlSets[ 0 ]?.controls
			) {
				controls = blockVisibility.controlSets[ 0 ].controls;
			} else {
				controls = {};
			}
		}

		// Some blocks have rendering issues when we set the icons to the
		// :before pseudo class. For those blocks, use a background image
		// instead.
		const backgroundBlocks = [ 'core/pullquote' ];

		let activeControls = {
			'date-time': hasDateTime(
				controls,
				hasControlSets,
				enabledControls
			),
			'user-role': hasUserRole(
				controls,
				hasControlSets,
				enabledControls
			),
			'screen-size': hasScreenSize(
				controls,
				hasControlSets,
				enabledControls,
				settings
			),
			'query-string': hasQueryString(
				controls,
				hasControlSets,
				enabledControls
			),
			acf: hasACF( controls, hasControlSets, enabledControls, variables ),
			'wp-fusion': hasWPFusion(
				controls,
				hasControlSets,
				enabledControls,
				variables
			),
		};

		activeControls = Object.keys( activeControls ).filter(
			( control ) => activeControls[ control ] === true
		);

		let controlsClass = '';

		if ( activeControls.length > 2 ) {
			controlsClass =
				'block-visibility__has-' + activeControls.length + '-controls';
		} else if ( activeControls.length !== 0 ) {
			controlsClass =
				'block-visibility__has-' + activeControls.join( '-' );
		}

		let classes = classnames(
			{
				'block-visibility__is-hidden': isHidden,
				'block-visibility__set-icon-background': backgroundBlocks.includes(
					name
				),
			},
			controlsClass
		);

		if ( classes ) {
			classes = classes + ' block-visibility__has-visibility';
		}

		classes = applyFilters(
			'blockVisibility.conditionalIndicatorClasses',
			classes
		);

		return <BlockListBlock { ...props } className={ classes } />;
	};
}

addFilter(
	'editor.BlockListBlock',
	'block-visibility/contextual-indicators',
	withContextualIndicators
);
