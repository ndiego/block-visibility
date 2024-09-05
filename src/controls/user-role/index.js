/**
 * External dependencies
 */
import { assign } from 'lodash';
import Select from 'react-select';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Notice } from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';
import { plus } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { DropdownIndicator, IndicatorSeparator } from '../../utils/react-select-utils';

/**
 * Internal dependencies
 */
import UserRoles from './user-roles';
import UserRuleSets from './user-rule-sets';
import Users from './users';
import links from './../../utils/links';
import isControlSettingEnabled from '../../utils/is-control-setting-enabled';
import { InformationPopover } from './../../components';

/**
 * Add the User Role control
 *
 * @since 1.6.0
 * @param {Object} props All the props passed to this function
 */
export default function UserRole( props ) {
	const {
		settings,
		variables,
		enabledControls,
		setControlAtts,
		controlSetAtts,
	} = props;
	const controlActive = enabledControls.some(
		( control ) =>
			control.settingSlug === 'visibility_by_role' && control.isActive
	);

	if ( ! controlActive ) {
		return null;
	}

	const userRole = controlSetAtts?.controls?.userRole ?? {};
	const visibilityByRole = userRole?.visibilityByRole ?? 'public';

	const settingsUrl = variables?.plugin_variables?.settings_url ?? ''; // eslint-disable-line
	const enableNotices = settings?.plugin_settings?.enable_editor_notices ?? true; // eslint-disable-line
	const enableUserRoles = isControlSettingEnabled(
		settings,
		'visibility_by_role',
		'enable_user_roles'
	);
	const enableUsers = isControlSettingEnabled(
		settings,
		'visibility_by_role',
		'enable_users'
	);
	const enableUserRuleSets = isControlSettingEnabled(
		settings,
		'visibility_by_role',
		'enable_user_rule_sets'
	);

	let options = [
		{
			label: __( 'Public', 'block-visibility' ),
			value: 'public',
		},
		{
			label: __( 'Logged-out', 'block-visibility' ),
			value: 'logged-out',
		},
		{
			label: __( 'Logged-in', 'block-visibility' ),
			value: 'logged-in',
		},
		{
			label: __( 'User roles', 'block-visibility' ),
			value: 'user-role',
		},
		{
			label: __( 'Users', 'block-visibility' ),
			value: 'users',
		},
		{
			label: __( 'User rule sets', 'block-visibility' ),
			value: 'user-rule-sets',
		},
	];

	const optionsHelp = [
		{
			label: __( 'Block is visible to everyone.', 'block-visibility' ),
			value: 'public',
		},
		{
			label: __(
				'Block is only visible to logged-out users.',
				'block-visibility'
			),
			value: 'logged-out',
		},
		{
			label: __(
				'Block is only visible to logged-in users.',
				'block-visibility'
			),
			value: 'logged-in',
		},
	];

	// If the User Roles option is not enabled in plugin settings, remove it.
	if ( ! enableUserRoles ) {
		options = options.filter( ( option ) => option.value !== 'user-role' );
	}

	// If the Users option is not enabled in plugin settings, remove it.
	if ( ! enableUsers ) {
		options = options.filter( ( option ) => option.value !== 'users' );
	}

	// If the User Rule Sets option is not enabled in plugin settings, remove it.
	if ( ! enableUserRuleSets ) {
		options = options.filter(
			( option ) => option.value !== 'user-rule-sets'
		);
	}

	const selectedOption = options.filter(
		( option ) => option.value === visibilityByRole
	);

	const helpMessage =
		optionsHelp.filter(
			( option ) => option.value === visibilityByRole
		)[ 0 ]?.label ?? '';

	const ruleSetsActive =
		enableUserRuleSets && visibilityByRole === 'user-rule-sets';
	const ruleSets = userRole?.ruleSets ?? [];

	if ( ruleSets.length === 0 ) {
		ruleSets.push( {
			enable: true,
			rules: [ { field: '' } ],
		} );
	}

	const addRuleSet = () => {
		const newRuleSets = [
			...ruleSets,
			{
				enable: true,
				rules: [ { field: '' } ],
			},
		];

		setControlAtts(
			'userRole',
			assign( { ...userRole }, { ruleSets: [ ...newRuleSets ] } )
		);
	};

	return (
		<div className="controls-panel-item user-role-control">
			<h3 className="controls-panel-item__header has-icon">
				<span>{ __( 'User Role', 'block-visibility' ) }</span>
				{ enableNotices && (
					<InformationPopover
						message={ __(
							"The User Role control allows you to configure block visibility based on the current user's role or specific users.",
							'block-visibility'
						) }
						link={ links.editor.userRole }
						position="bottom center"
					/>
				) }
				{ ruleSetsActive && (
					<div className="controls-panel-item__header-toolbar">
						<Button
							icon={ plus }
							onClick={ () => addRuleSet() }
							label={ __( 'Add rule set', 'block-visibility' ) }
							size="small"
						/>
					</div>
				) }
			</h3>
			<div className="controls-panel-item__control-fields">
				<div className="control-fields-item">
					<Select
						className="block-visibility__react-select"
						classNamePrefix="react-select"
						components={ { DropdownIndicator, IndicatorSeparator } }
						options={ options }
						value={ selectedOption }
						onChange={ ( value ) =>
							setControlAtts(
								'userRole',
								assign(
									{ ...userRole },
									{ visibilityByRole: value.value }
								)
							)
						}
					/>
					{ enableNotices && helpMessage && (
						<div className="control-fields-item__help">
							{ helpMessage }
						</div>
					) }
				</div>
				{ visibilityByRole === 'user-role' && enableUserRoles && (
					<UserRoles
						variables={ variables }
						userRole={ userRole }
						setControlAtts={ setControlAtts }
						enableNotices={ enableNotices }
						{ ...props }
					/>
				) }
				{ visibilityByRole === 'users' && enableUsers && (
					<Users
						variables={ variables }
						userRole={ userRole }
						setControlAtts={ setControlAtts }
						enableNotices={ enableNotices }
						{ ...props }
					/>
				) }
				{ visibilityByRole === 'user-rule-sets' &&
					enableUserRuleSets && (
						<UserRuleSets
							ruleSets={ ruleSets }
							setControlAtts={ setControlAtts }
							userRole={ userRole }
							variables={ variables }
							enableNotices={ enableNotices }
							{ ...props }
						/>
					) }
				{ ! options.some(
					( option ) => option.value === visibilityByRole
				) && (
					<Notice status="warning" isDismissible={ false }>
						{ createInterpolateElement(
							__(
								'The previously selected User Role option has been disabled. Choose another option or update the <a>Visibility Control</a> settings.',
								'block-visibility'
							),
							{
								a: (
									<a // eslint-disable-line
										href={
											settingsUrl +
											'&tab=visibility-controls'
										}
										target="_blank"
										rel="noreferrer"
									/>
								),
							}
						) }
					</Notice>
				) }
			</div>
		</div>
	);
}
