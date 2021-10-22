/**
 * External dependencies
 */
import { assign } from 'lodash';
import Select from 'react-select';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Disabled, Modal, Notice } from '@wordpress/components';
import { Icon, info } from '@wordpress/icons';
import { createInterpolateElement, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import icons from './../../../utils/icons';
import Tips from './notices-tips';

/**
 * Add the Wp Fusion controls
 *
 * @since 1.7.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function WPFusion( props ) {
	const [ tipsModalOpen, setTipsModalOpen ] = useState( false );
	const {
		variables,
		enabledControls,
		controlSetAtts,
		setControlAtts,
	} = props;
	const pluginActive = variables?.integrations?.wp_fusion?.active ?? false;
	const controlEnabled = enabledControls.some(
		( control ) => control.settingSlug === 'wp_fusion'
	);
	const controlToggledOn =
		controlSetAtts?.controls.hasOwnProperty( 'wpFusion' ) ?? false;

	if ( ! controlEnabled || ! controlToggledOn || ! pluginActive ) {
		return null;
	}

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
			<div className="visibility-control wp-fusion__tags-any">
				<div className="visibility-control__label">
					{ __( 'Required Tags (Any)', 'block-visibility' ) }
				</div>
				<Select
					className="block-visibility__react-select"
					classNamePrefix="react-select"
					options={ availableTags }
					value={ tagsAny }
					placeholder={ __( 'Select Tag…', 'block-visibility' ) }
					onChange={ ( value ) => handleOnChange( 'tagsAny', value ) }
					isMulti
				/>
				<div className="visibility-control__help">
					{ __(
						'Only visible to logged-in users with at least one of the selected tags.',
						'block-visibility'
					) }
				</div>
			</div>
			<div className="visibility-control wp-fusion__tags-all">
				<div className="visibility-control__label">
					{ __( 'Required Tags (All)', 'block-visibility' ) }
				</div>
				<Select
					className="block-visibility__react-select"
					classNamePrefix="react-select"
					options={ availableTags }
					value={ tagsAll }
					placeholder={ __( 'Select Tag…', 'block-visibility' ) }
					onChange={ ( value ) => handleOnChange( 'tagsAll', value ) }
					isMulti
				/>
				<div className="visibility-control__help">
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
			</div>
		</>
	);

	if ( userRoles === 'public' || userRoles === 'logged-out' ) {
		anyAllFields = <Disabled>{ anyAllFields }</Disabled>;
	}

	let notField = (
		<div className="visibility-control wp-fusion__tags-not">
			<div className="visibility-control__label">
				{ __( 'Required Tags (Not)', 'block-visibility' ) }
			</div>
			<Select
				className="block-visibility__react-select"
				classNamePrefix="react-select"
				options={ availableTags }
				value={ tagsNot }
				placeholder={ __( 'Select Tag…', 'block-visibility' ) }
				onChange={ ( value ) => handleOnChange( 'tagsNot', value ) }
				isMulti
			/>
			<div className="visibility-control__help">
				{ __(
					'Hide from logged-in users with at least one of the selected tags.',
					'block-visibility'
				) }
			</div>
		</div>
	);

	if ( userRoles === 'logged-out' ) {
		notField = <Disabled>{ notField }</Disabled>;
	}

	return (
		<>
			<div className="visibility-control__group wp-fusion-control">
				<h3 className="visibility-control__group-heading has-icon">
					<Icon icon={ icons.wpFusion } />
					<span>
						{ __( 'WP Fusion', 'block-visibility' ) }
						<Button
							label={ __( 'Wp Fusion Tips', 'block-visibility' ) }
							icon={ info }
							className="control-tips"
							onClick={ () =>
								setTipsModalOpen( ( open ) => ! open )
							}
							isSmall
						/>
					</span>
				</h3>
				{ anyAllFields }
				{ notField }
				{ ! hasUserRoles && (
					<Notice status="warning" isDismissible={ false }>
						{ __(
							'The WP Fusion control works best in coordination with the User Role control, which has been disabled. To re-enable, click the three dots icon in the Controls Toolbar above.',
							'block-visibility'
						) }
					</Notice>
				) }
			</div>
			<div className="control-separator">
				<span>{ __( 'AND', 'block-visibility' ) }</span>
			</div>
			{ tipsModalOpen && (
				<Modal
					className="block-visibility__tips-modal"
					title={ __( 'WP Fusion Control', 'block-visibility' ) }
					onRequestClose={ () => setTipsModalOpen( false ) }
				>
					<Tips { ...props } />
				</Modal>
			) }
		</>
	);
}
