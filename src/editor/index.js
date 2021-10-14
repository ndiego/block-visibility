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
import { useState } from '@wordpress/element';
import { addFilter, applyFilters } from '@wordpress/hooks';
import { hasBlockSupport } from '@wordpress/blocks';
import { registerPlugin } from '@wordpress/plugins';
import { Modal } from '@wordpress/components';
import { PluginMoreMenuItem } from '@wordpress/edit-post';

/**
 * Internal dependencies
 */
import VisibilityInspectorControls from './inspector-controls';
import ToolbarControls from './toolbar-controls';
import PresetsManager from './presets';
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
 * @param {Object} settings All settings associated with a block type.
 * @return {Object} settings The updated array of settings.
 */
function addAttributes( settings ) {
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
							title: {
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
														title: {
															type: 'string',
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
											hideOnSchedules: {
												type: 'boolean',
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
											hideOnRestrictedUsers: {
												type: 'boolean',
											},
											restrictedUsers: {
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
									acf: {
										type: 'object',
										properties: {
											enable: {
												type: 'boolean',
											},
											hideOnRuleSets: {
												type: 'boolean',
											},
											ruleSets: {
												type: 'array',
												items: {
													type: [ 'array', 'object' ],
													items: {
														type: 'object',
														properties: {
															field: {
																type: 'string',
															},
															operator: {
																type: 'string',
															},
															value: {
																type: 'string',
															},
														},
													},
													properties: {
														id: {
															type: 'number',
														},
														title: {
															type: 'string',
														},
														enable: {
															type: 'boolean',
														},
														rules: {
															type: 'array',
															items: {
																type: 'object',
																properties: {
																	field: {
																		type:
																			'string',
																	},
																	subField: {
																		type: [
																			'string',
																			'integer',
																			'array',
																		],
																	},
																	operator: {
																		type:
																			'string',
																	},
																	value: {
																		type: [
																			'string',
																			'integer',
																			'array',
																		],
																	},
																},
															},
														},
													},
												},
											},
										},
									},
									wpFusion: {
										type: 'object',
										properties: {
											enable: {
												type: 'boolean',
											},
											tagsAny: {
												type: 'array',
												items: {
													type: [
														'number',
														'string',
													],
												},
											},
											tagsAll: {
												type: 'array',
												items: {
													type: [
														'number',
														'string',
													],
												},
											},
											tagsNot: {
												type: 'array',
												items: {
													type: [
														'number',
														'string',
													],
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
	'block-visibility/add-attributes',
	addAttributes
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
	'block-visibility/apply-visibility-classes',
	applyVisibilityClasses
);

/**
 * Filter the BlockEdit object and add visibility controls to selected blocks.
 *
 * @since 1.0.0
 * @param {Object} BlockEdit
 */
function addInspectorControls( BlockEdit ) {
	return ( props ) => {
		if ( props.isSelected ) {
			return (
				<>
					<BlockEdit { ...props } />
					<VisibilityInspectorControls { ...props } />
				</>
			);
		}

		return <BlockEdit { ...props } />;
	};
}

addFilter(
	'editor.BlockEdit',
	'block-visibility/add-inspector-controls',
	addInspectorControls,
	100 // We want Visibility to appear right above Advanced controls
);

/**
 * Register all Block Visibility related plugins to the editor.
 */
registerPlugin( 'block-visibility-toolbar-options-hide-block', {
	render: ToolbarControls,
} );

function PluginMoreMenuButton( props ) {
	const [ isModalOpen, setModalOpen ] = useState( false );

	return (
		<>
			<PluginMoreMenuItem
				icon={ <svg viewBox="0 0 100 83" xmlns="http://www.w3.org/2000/svg" width="20" height="17" role="img" aria-hidden="true" focusable="false"><path d="M54.652 82.94h-4.478c-18.041-.97-32.98-13.58-37.465-30.452 11.483 7.418 23.952 9.971 38.858 11.998a140.911 140.911 0 0 1-7.237-2.076c-13.331-4.218-24.815-9.989-32.758-15.981a59.48 59.48 0 0 1-1.536-1.196l-.003-.003a52.68 52.68 0 0 1-1.447-1.207 45.189 45.189 0 0 1-1.308-1.174l-.041-.038a43.104 43.104 0 0 1-1.179-1.144l-.066-.067a35.327 35.327 0 0 1-1.045-1.106l-.093-.102c-.319-.356-.621-.71-.911-1.063l-.114-.137c-.275-.34-.532-.678-.779-1.015-.043-.059-.088-.117-.13-.176a21.884 21.884 0 0 1-.653-.965c-.046-.07-.094-.141-.138-.212a18.867 18.867 0 0 1-.532-.913c-.045-.083-.095-.166-.139-.249a16.448 16.448 0 0 1-.416-.86c-.042-.094-.091-.189-.131-.283a13.514 13.514 0 0 1-.308-.811c-.036-.103-.08-.208-.113-.311a10.93 10.93 0 0 1-.208-.766c-.027-.111-.062-.223-.085-.334-.052-.245-.083-.486-.114-.727-.015-.115-.039-.233-.05-.348-.022-.236-.022-.468-.024-.701-.001-.115-.012-.232-.008-.347.008-.242.04-.479.07-.717.013-.1.015-.202.032-.302a7.176 7.176 0 0 1 .539-1.778l.008-.015c.81-1.792 2.346-3.274 4.476-4.448l-.003-.001c2.408-1.323 5.58-2.249 9.346-2.768-1.196 4.197-1.75 8.209-1.606 11.912a41.02 41.02 0 0 1 5.165-12.564c.4-.644.824-1.263 1.254-1.877C26.76 7.431 38.809.813 52.413.813c21.643 0 39.366 16.736 40.963 37.971a41.004 41.004 0 0 1-1.341 12.753c1.084-1.572 1.976-3.44 2.707-5.499 4.181 4.511 6.061 8.91 4.885 12.629-1.375 4.346-6.699 7.055-14.474 8.067-7.083 9.327-18.054 15.537-30.5 16.206zm-6.569-37.951c-.321-.9-.48-1.93-.48-3.09 0-1.051.145-2.003.435-2.859.29-.854.702-1.587 1.237-2.197a5.512 5.512 0 0 1 1.943-1.417c.76-.335 1.615-.502 2.565-.502.51 0 .97.024 1.38.074a6.897 6.897 0 0 1 2.257.667c.355.176.733.384 1.133.624.32.2.63.3.93.3.23 0 .443-.06.637-.18.195-.12.363-.286.503-.495l1.47-2.236a10.043 10.043 0 0 0-3.353-2.1 12.702 12.702 0 0 0-2.212-.614c-.8-.15-1.655-.225-2.565-.225-1.76 0-3.353.274-4.778.825-1.425.55-2.64 1.319-3.645 2.309a10.12 10.12 0 0 0-2.317 3.533c-.54 1.365-.81 2.863-.81 4.493 0 1.6.282 3.082.847 4.447a10.76 10.76 0 0 0 2.34 3.54 10.76 10.76 0 0 0 3.533 2.34c1.359.566 2.84.848 4.44.848.89 0 1.722-.045 2.497-.135.775-.091 1.505-.23 2.19-.421a11.123 11.123 0 0 0 3.683-1.784v-9.226h-7.77v2.791c0 .26.09.475.27.645.18.17.43.255.75.255h2.16v3.314c-.48.201-.99.361-1.53.481s-1.16.18-1.86.18c-.92 0-1.768-.163-2.543-.488a5.638 5.638 0 0 1-2.01-1.418c-.565-.619-1.007-1.38-1.327-2.279z"></path></svg>}
				onClick={ () => setModalOpen( true ) }
			>
				{ __( 'Block Visibility', 'block-visibility' ) }
			</PluginMoreMenuItem>
			{ isModalOpen && (
				<Modal
					className="block-visibility-preset-manager-modal"
					title={ __(
						'Block Visibility Presets',
						'block-visibility'
					) }
					onRequestClose={ () => setModalOpen( false ) }
				>
					<PresetsManager />
				</Modal>
			) }
		</>
	);
}

registerPlugin(
    'block-visibility-editor-settings',
    { render: PluginMoreMenuButton }
);
