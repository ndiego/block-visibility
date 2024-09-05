/**
 * External dependencies
 */
import { assign } from 'lodash';
import Select from 'react-select';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Disabled, Notice } from '@wordpress/components';
import { Icon } from '@wordpress/icons';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { wpFusion as wpFusionIcon } from './../../utils/icons';
import links from './../../utils/links';
import { InformationPopover } from './../../components';
import {
	ClearIndicator,
	DropdownIndicator,
	IndicatorSeparator,
	MultiValueRemove,
} from './../../utils/react-select-utils';

/**
 * Add the Wp Fusion controls
 *
 * @since 1.7.0
 * @param {Object} props All the props passed to this function
 */
export default function WPFusion( props ) {
	const {
		controlSetAtts,
		enabledControls,
		setControlAtts,
		settings,
		variables,
	} = props;
	const pluginActive = variables?.integrations?.wp_fusion?.active ?? false;
	const controlActive = enabledControls.some(
		( control ) => control.settingSlug === 'wp_fusion' && control?.isActive
	);

	if ( ! controlActive || ! pluginActive ) {
		return null;
	}

	const enableNotices =
		settings?.plugin_settings?.enable_editor_notices ?? true;
	const hasUserRoles =
		controlSetAtts?.controls.hasOwnProperty( 'userRole' ) ?? false;
	const userRoles =
		controlSetAtts?.controls?.userRole?.visibilityByRole ?? 'public';
	const availableTags = variables?.integrations?.wp_fusion?.tags ?? [];

	// Concert array of tag value to array of tag objects with values and labels.
	const convertTags = ( tags ) => {
		const selectedTags = availableTags.filter( ( tag ) =>
			tags.includes( tag.value )
		);
		return selectedTags;
	};

	const wpFusion = controlSetAtts?.controls?.wpFusion ?? {};
	const tagsAny = convertTags( wpFusion?.tagsAny ?? [] );
	const tagsAll = convertTags( wpFusion?.tagsAll ?? [] );
	const tagsNot = convertTags( wpFusion?.tagsNot ?? [] );

	const handleOnChange = ( attribute, tags ) => {
		const newTags = [];

		if ( tags.length !== 0 ) {
			tags.forEach( ( tag ) => {
				newTags.push( tag.value );
			} );
		}

		setControlAtts(
			'wpFusion',
			assign( { ...wpFusion }, { [ attribute ]: newTags } )
		);
	};

	let anyAllFields = (
		<>
			<div className="control-fields-item">
				<div className="components-base-control__label">
					{ createInterpolateElement(
						__(
							'Required Tags <span>(Any)</span>',
							'block-visibility'
						),
						{
							span: (
								<span className="components-base-control__label-hint" />
							),
						}
					) }
				</div>
				<Select
					className="block-visibility__react-select"
					classNamePrefix="react-select"
					components={ {
						ClearIndicator,
						DropdownIndicator,
						IndicatorSeparator,
						MultiValueRemove,
					} }
					options={ availableTags }
					value={ tagsAny }
					placeholder={ __( 'Select Tag…', 'block-visibility' ) }
					onChange={ ( value ) => handleOnChange( 'tagsAny', value ) }
					isMulti
				/>
				{ enableNotices && (
					<div className="components-base-control__help">
						{ __(
							'Only visible to logged-in users with at least one of the selected tags.',
							'block-visibility'
						) }
					</div>
				) }
			</div>
			<div className="control-fields-item">
				<div className="components-base-control__label">
					{ createInterpolateElement(
						__(
							'Required Tags <span>(All)</span>',
							'block-visibility'
						),
						{
							span: (
								<span className="components-base-control__label-hint" />
							),
						}
					) }
				</div>
				<Select
					className="block-visibility__react-select"
					classNamePrefix="react-select"
					components={ {
						ClearIndicator,
						DropdownIndicator,
						IndicatorSeparator,
						MultiValueRemove,
					} }
					options={ availableTags }
					value={ tagsAll }
					placeholder={ __( 'Select Tag…', 'block-visibility' ) }
					onChange={ ( value ) => handleOnChange( 'tagsAll', value ) }
					isMulti
				/>
				{ enableNotices && (
					<div className="components-base-control__help">
						{ createInterpolateElement(
							__(
								'Only visible to logged-in users with <strong>all</strong> of the selected tags.',
								'block-visibility'
							),
							{
								strong: <strong />,
							}
						) }
					</div>
				) }
			</div>
		</>
	);

	if ( userRoles === 'public' || userRoles === 'logged-out' ) {
		anyAllFields = <Disabled>{ anyAllFields }</Disabled>;
	}

	let notField = (
		<div className="control-fields-item">
			<div className="components-base-control__label">
				{ createInterpolateElement(
					__(
						'Required Tags <span>(Not)</span>',
						'block-visibility'
					),
					{
						span: (
							<span className="components-base-control__label-hint" />
						),
					}
				) }
			</div>
			<Select
				className="block-visibility__react-select"
				classNamePrefix="react-select"
				components={ {
					ClearIndicator,
					DropdownIndicator,
					IndicatorSeparator,
					MultiValueRemove,
				} }
				options={ availableTags }
				value={ tagsNot }
				placeholder={ __( 'Select Tag…', 'block-visibility' ) }
				onChange={ ( value ) => handleOnChange( 'tagsNot', value ) }
				isMulti
			/>
			{ enableNotices && (
				<div className="components-base-control__help">
					{ __(
						'Hide from logged-in users with at least one of the selected tags.',
						'block-visibility'
					) }
				</div>
			) }
		</div>
	);

	if ( userRoles === 'logged-out' ) {
		notField = <Disabled>{ notField }</Disabled>;
	}

	return (
		<div className="controls-panel-item wp-fusion-control">
			<h3 className="controls-panel-item__header has-icon">
				<Icon icon={ wpFusionIcon } />
				<span>{ __( 'WP Fusion', 'block-visibility' ) }</span>
				{ enableNotices && (
					<InformationPopover
						message={ __(
							'The WP Fusion control allows you to configure block visibility based on WP Fusion tags.',
							'block-visibility'
						) }
						subMessage={ __(
							'Note that the available fields depend on the User Role control settings. If the User Role control is disabled, only the Required Tags (Not) field will be available.',
							'block-visibility'
						) }
						link={ links.editor.wpFusion }
						position="bottom center"
					/>
				) }
			</h3>
			<div className="controls-panel-item__control-fields">
				{ anyAllFields }
				{ notField }
				{ ! hasUserRoles && (
					<Notice status="warning" isDismissible={ false }>
						{ __(
							'The WP Fusion control works best in coordination with the User Role control, which has been disabled.',
							'block-visibility'
						) }
					</Notice>
				) }
			</div>
		</div>
	);
}
