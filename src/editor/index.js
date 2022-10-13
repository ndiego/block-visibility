/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';
import { addFilter, applyFilters } from '@wordpress/hooks';
import { hasBlockSupport } from '@wordpress/blocks';
import { registerPlugin } from '@wordpress/plugins';
import { Slot, Fill } from '@wordpress/components';

/**
 * Internal dependencies
 */
import VisibilityInspectorControls from './inspector-controls';
import ToolbarControls from './toolbar-controls';
import ControlSet from './inspector-controls/control-set';
import './contextual-indicators';

import UserRole from './../controls/user-role';
import DateTime from './../controls/date-time';
import ScreenSize from './../controls/screen-size';
import QueryString from './../controls/query-string';
import ACF from './../controls/acf';
import WPFusion from './../controls/wp-fusion';

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
									userRole: {
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
											hideOnRuleSets: {
												type: 'boolean',
											},
											ruleSets: {
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
														rules: {
															type: 'array',
															items: {
																type: 'object',
																properties: {
																	field: {
																		type: 'string',
																	},
																	subField: {
																		type: [
																			'string',
																			'integer',
																			'array',
																		],
																	},
																	subFields: {
																		type: 'object',
																	},
																	operator: {
																		type: 'string',
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
																		type: 'string',
																	},
																	subField: {
																		type: [
																			'string',
																			'integer',
																			'array',
																		],
																	},
																	operator: {
																		type: 'string',
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
 * Filter the BlockEdit object and add visibility controls to selected blocks.
 *
 * @since 1.0.0
 * @param {Object} BlockEdit
 */
function addInspectorControls( BlockEdit ) {
	return ( props ) => {
		return (
			<>
				<BlockEdit { ...props } />
				<VisibilityInspectorControls { ...props } />
			</>
		);
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

/**
 * Add the control set component to the preset manager in Block Visibility Pro.
 */
function addPresetManagerControlSet() {
	return ( props ) => {
		const { controlSetAtts, setControlSetAtts, index, type } = props;

		// There needs to be a unique index for the Slots since we technically have
		// multiple of the same Slot.
		const uniqueIndex =
			type === 'single' ? type : type + '-' + controlSetAtts?.id;

		function setControlAtts( control, values ) {
			const newControls = controlSetAtts?.controls ?? {};
			const newControlSetAtts = assign(
				{ ...controlSetAtts },
				{
					controls: assign( { ...newControls }, { [ control ]: values } ),
				}
			);
	
			setControlSetAtts( newControlSetAtts );
		}

		return (
			<Fill name={ 'PresetManagerControlSet-' + type + '-' + index }>
				test
				<div className="control-set__controls">
					<Slot name={ 'ControlSetControlsTop-' + uniqueIndex } />

					<DateTime setControlAtts={ setControlAtts } { ...props } />
					<UserRole setControlAtts={ setControlAtts } { ...props } />
					<ScreenSize setControlAtts={ setControlAtts } { ...props } />
					<QueryString setControlAtts={ setControlAtts } { ...props } />

					<Slot name={ 'ControlSetControlsMiddle-' + uniqueIndex } />

					<ACF setControlAtts={ setControlAtts } { ...props } />
					<WPFusion setControlAtts={ setControlAtts } { ...props } />

					<Slot name={ 'ControlSetControlsBottom-' + uniqueIndex } />
				</div>
			</Fill>
		);
	};
}

addFilter(
	'blockVisibilityPro.addPresetManagerControlSet',
	'block-visibility/preset-manager-control-set',
	addPresetManagerControlSet
);
