/**
 * External dependencies
 */
import { assign } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';
import { addFilter, applyFilters } from '@wordpress/hooks';
import { hasBlockSupport } from '@wordpress/blocks';
import { registerPlugin } from '@wordpress/plugins';

/**
 * Internal dependencies
 */
import VisibilityInspectorControls from './inspector-controls';
import ToolbarControls from './toolbar-controls';
import './contextual-indicators';

/**
 * Add our custom entities for retreiving external data in the Block Editor.
 *
 * @since 1.3.0
 */
dispatch( 'core' ).addEntities( [
	{
		label: __( 'Block Visibility Settings', 'block-visibility' ),
		kind: 'block-visibility/v1',
		name: 'settings',
		baseURL: '/block-visibility/v1/settings',
	},
	{
		label: __( 'Block Visibility Variables', 'block-visibility' ),
		kind: 'block-visibility/v1',
		name: 'variables',
		baseURL: '/block-visibility/v1/variables',
	},
] );

/**
 * Add the visibility setting sttribute to selected blocks.
 *
 * @since 1.0.0
 * @param {Object}  settings All settings associated with a block type.
 * @return {Object} settings The updated array of settings.
 */
function blockVisibilityAttributes( settings ) {
	// The freeform (Classic Editor) block is incompatible because it does not
	// support custom attributes.
	if ( settings.name === 'core/freeform' ) {
		return settings;
	}

	// This is a global variable added to the page via PHP.
	const fullControlMode = blockVisibilityFullControlMode; // eslint-disable-line

	// Add the block visibility attributes.
	let attributes = {
		blockVisibility: {
			type: 'object',
			properties: {
				hideBlock: {
					type: 'boolean',
				},
				controlSets: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id: {
								type: 'number',
							},
							name: {
								type: 'string',
							},
							enable: {
								type: 'boolean',
							},
							controls: {
								type: 'object',
								properties: {
									dateTime: {
										type: 'object',
										properties: {
											schedules: {
												type: 'array',
												items: {
													type: 'object',
													properties: {
														id: {
															type: 'number',
														},
														enable: {
															type: 'boolean',
														},
														start: {
															type: 'string',
														},
														end: {
															type: 'string',
														},
													},
												},
											},
										},
									},
									userRoles: {
										type: 'object',
										properties: {
											enable: {
												type: 'boolean',
											},
											visibilityByRole: {
												type: 'string',
											},
											hideOnRestrictedRoles: {
												type: 'boolean',
											},
											restrictedRoles: {
												type: 'array',
												items: {
													type: 'string',
												},
											},
										},
									},
									screenSize: {
										type: 'object',
										properties: {
											enable: {
												type: 'boolean',
											},
											hideOnScreenSize: {
												type: 'object',
												properties: {
													extraLarge: {
														type: 'boolean',
													},
													large: {
														type: 'boolean',
													},
													medium: {
														type: 'boolean',
													},
													small: {
														type: 'boolean',
													},
													extraSmall: {
														type: 'boolean',
													},
												},
											},
										},
									},
									queryString: {
										type: 'object',
										properties: {
											enable: {
												type: 'boolean',
											},
											queryStringAny: {
												type: 'string',
											},
											queryStringAll: {
												type: 'string',
											},
											queryStringNot: {
												type: 'string',
											},
										},
									},
									// Integrations
									wpFusion: {
										type: 'object',
										properties: {
											enable: {
												type: 'boolean',
											},
											tagsAny: {
												type: 'array',
												items: {
													type: [ 'number', 'string' ],
												},
											},
											tagsAll: {
												type: 'array',
												items: {
													type: [ 'number', 'string' ],
												},
											},
											tagsNot: {
												type: 'array',
												items: {
													type: [ 'number', 'string' ],
												},
											},
										},
									},
								},
							},
						},
					},
				},
				// Depracated attributes
				visibilityByRole: {
					type: 'string',
				},
				hideOnRestrictedRoles: {
					type: 'boolean',
				},
				restrictedRoles: {
					type: 'array',
					items: {
						type: 'string',
					},
				},
				scheduling: {
					type: 'object',
					properties: {
						enable: {
							type: 'boolean',
						},
						start: {
							type: 'string',
						},
						end: {
							type: 'string',
						},
					},
				},
				hideOnScreenSize: {
					type: 'object',
					properties: {
						extraLarge: {
							type: 'boolean',
						},
						large: {
							type: 'boolean',
						},
						medium: {
							type: 'boolean',
						},
						small: {
							type: 'boolean',
						},
						extraSmall: {
							type: 'boolean',
						},
					},
				},
				startDateTime: {
					type: 'string',
				},
				endDateTime: {
					type: 'string',
				},
			},
		},
	};

	// Filter allows the pro plugin to add Block Visibility attributes.
	attributes = applyFilters( 'blockVisibility.attributes', attributes );

	// We don't want to enable visibility for blocks that cannot be added via
	// the inserter or is a child block. This excludes blocks such as reusable
	// blocks, individual column block, etc. But if we are in Full Control Mode
	// add settings to every block.
	if (
		fullControlMode ||
		( hasBlockSupport( settings, 'inserter', true ) &&
			! settings.hasOwnProperty( 'parent' ) )
	) {
		settings.attributes = assign( settings.attributes, attributes );
		settings.supports = assign( settings.supports, {
			blockVisibility: true,
		} );
	}

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'block-visibility/attributes',
	blockVisibilityAttributes
);

/**
 * Filter the BlockEdit object and add visibility controls to selected blocks.
 *
 * @since 1.0.0
 * @param {Object} BlockEdit
 */
function blockVisibilityInspectorControls( BlockEdit ) {
	return ( props ) => (
		<>
			<BlockEdit { ...props } />
			<VisibilityInspectorControls { ...props } />
		</>
	);
}

addFilter(
	'editor.BlockEdit',
	'block-visibility/inspector-controls',
	blockVisibilityInspectorControls,
	100 // We want Visibility to appear right above Advanced controls
);

/**
 * Override props assigned to save component to inject atttributes
 *
 * @param {Object} extraProps Additional props applied to save element.
 * @param {Object} blockType  Block type.
 * @param {Object} attributes Current block attributes.
 * @return {Object} Filtered props applied to save element.
 */
function applyVisibilityClasses( extraProps, blockType, attributes ) {
	const { blockVisibility } = attributes;
	const hasControlSets = blockVisibility?.controlSets ?? false;
	let testAtts = blockVisibility;

	if ( hasControlSets ) {
		// The control set array is empty or the default set has no applied controls.
		if (
			blockVisibility.controlSets.length !== 0 &&
			blockVisibility.controlSets[ 0 ]?.controls
		) {
			testAtts =
				blockVisibility.controlSets[ 0 ].controls?.screenSize ?? null;
		} else {
			testAtts = null;
		}
	}

	if ( ! testAtts ) {
		return extraProps;
	}

	// Conditionally add the screen size control classes.
	const hideExtraLarge = testAtts?.hideOnScreenSize?.extraLarge ?? false;
	const hideLarge = testAtts?.hideOnScreenSize?.large ?? false;
	const hideMedium = testAtts?.hideOnScreenSize?.medium ?? false;
	const hideSmall = testAtts?.hideOnScreenSize?.small ?? false;
	const hideExtraSmall = testAtts?.hideOnScreenSize?.extraSmall ?? false;

	if ( hideExtraLarge ) {
		extraProps.className = classnames(
			extraProps.className,
			'block-visibility-hide-extra-large-screen'
		);
	}

	if ( hideLarge ) {
		extraProps.className = classnames(
			extraProps.className,
			'block-visibility-hide-large-screen'
		);
	}

	if ( hideMedium ) {
		extraProps.className = classnames(
			extraProps.className,
			'block-visibility-hide-medium-screen'
		);
	}

	if ( hideSmall ) {
		extraProps.className = classnames(
			extraProps.className,
			'block-visibility-hide-small-screen'
		);
	}

	if ( hideExtraSmall ) {
		extraProps.className = classnames(
			extraProps.className,
			'block-visibility-hide-extra-small-screen'
		);
	}

	return extraProps;
}

addFilter(
	'blocks.getSaveContent.extraProps',
	'block-visibility/applyVisibilityClasses',
	applyVisibilityClasses
);

/**
 * Register all Block Visibility related plugins to the editor.
 */
registerPlugin( 'block-visibility-toolbar-options-hide-block', {
	render: ToolbarControls,
} );
