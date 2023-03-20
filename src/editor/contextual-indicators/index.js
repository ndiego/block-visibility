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
import {
	hasACF,
	hasBrowserDevice,
	hasCookie,
	hasDateTime,
	hasLocation,
	hasMetadata,
	hasQueryString,
	hasReferralSource,
	hasScreenSize,
	hasUrlPath,
	hasUserRole,
	hasVisibilityPresets,
	hasWPFusion,
} from './indicator-tests';
import hasVisibilityControls from './../utils/has-visibility-controls';
import usePluginData from './../utils/use-plugin-data';
import isPluginSettingEnabled from './../../utils/is-plugin-setting-enabled';
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

		let activeControls = {
			acf: hasACF( controls, hasControlSets, enabledControls, variables ),
			'browser-device': hasBrowserDevice(
				controls,
				hasControlSets,
				enabledControls
			),
			cookie: hasCookie( controls, hasControlSets, enabledControls ),
			'date-time': hasDateTime(
				controls,
				hasControlSets,
				enabledControls
			),
			location: hasLocation( controls, hasControlSets, enabledControls ),
			metadata: hasMetadata( controls, hasControlSets, enabledControls ),
			'query-string': hasQueryString(
				controls,
				hasControlSets,
				enabledControls
			),
			'referral-source': hasReferralSource(
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
			'url-path': hasUrlPath( controls, hasControlSets, enabledControls ),
			'user-role': hasUserRole(
				controls,
				hasControlSets,
				enabledControls
			),
			'visibility-presets': hasVisibilityPresets(
				blockVisibility,
				enabledControls
			),
			'wp-fusion': hasWPFusion(
				controls,
				hasControlSets,
				enabledControls,
				variables
			),
		};

		activeControls = applyFilters(
			'blockVisibility.contextualIndicatorActiveControls',
			activeControls,
			blockVisibility,
			controls,
			hasControlSets,
			enabledControls,
			variables
		);

		// Deprecated filter as of v2.5.1, use contextualIndicatorActiveControls instead.
		activeControls = applyFilters(
			'blockVisibility.conditionalIndicatorActiveCoreControls',
			activeControls,
			blockVisibility,
			controls,
			hasControlSets,
			enabledControls,
			variables
		);

		activeControls = Object.keys( activeControls ).filter(
			( control ) => activeControls[ control ] === true
		);

		// Check if local controls are enabled.
		const enableLocalControls =
			settings?.visibility_controls?.general?.enable_local_controls ??
			true;

		// If local controls have been disabled, remove them from the array.
		if ( ! enableLocalControls ) {
			activeControls = activeControls.filter(
				( control ) =>
					control === 'hide-block' || control === 'visibility-presets'
			);
		}

		// Sort active controls in ASC order.
		activeControls.sort();

		let controlsClass = '';

		if ( activeControls.length > 1 ) {
			controlsClass =
				'block-visibility__has-' + activeControls.length + '-controls';
		} else if ( activeControls.length !== 0 ) {
			controlsClass =
				'block-visibility__has-' + activeControls.join( '-' );
		}

		let classes = classnames(
			{
				'block-visibility__is-hidden': isHidden,
			},
			controlsClass
		);

		if ( classes ) {
			classes = classes + ' block-visibility__has-visibility';
		}

		classes = applyFilters(
			'blockVisibility.contextualIndicatorClasses',
			classes
		);

		// Deprecated filter as of v2.5.1, use contextualIndicatorClasses instead.
		classes = applyFilters(
			'blockVisibility.conditionalIndicatorClasses',
			classes
		);

		// Add any other classes that might have been added using the same filter.
		const finalClasses = classnames( props?.className, classes );

		return <BlockListBlock { ...props } className={ finalClasses } />;
	};
}

addFilter(
	'editor.BlockListBlock',
	'block-visibility/contextual-indicators',
	withContextualIndicators
);
