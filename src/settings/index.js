/**
 * External dependencies
 */
import { findKey } from 'lodash';
import classnames from 'classnames';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';
import { useEntityRecord } from '@wordpress/core-data';
import { useCallback, useMemo, useState, render } from '@wordpress/element';
import { registerCoreBlocks } from '@wordpress/block-library';
import {
	Spinner,
	TabPanel,
	Slot,
	SlotFillProvider,
	withFilters,
} from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import Masthead from './masthead';
import Footer from './footer';
import VisibilityControls from './visibility-controls';
import BlockManager from './block-manager';
import PluginSettings from './plugin-settings';
import Ads from './ads';

/**
 * Add our custom entities for retrieving external setting and variable data.
 *
 * @since 2.5.0
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
		baseURLParams: {
			type: 'simplified',
		},
	},
] );

// Provides an entry point to slot in additional settings. Must be placed
// outside of function to avoid unnecessary rerenders.
const AdditionalSettingTabs = withFilters(
	'blockVisibility.SettingTabsContent'
)( ( props ) => <></> ); // eslint-disable-line

/**
 * Renders the Block Visibility settings page
 *
 * @since 1.0.0
 */
function Settings() {
	const [ settings, setSettings ] = useState( null );
	const settingsData = useEntityRecord( 'block-visibility/v1', 'settings' );
	const variablesData = useEntityRecord( 'block-visibility/v1', 'variables' );
	const onSetSettings = useCallback( ( newSettings ) => {
		setSettings( newSettings );
	}, [] );

	const settingTabs = useMemo( () => {
		const tabs = [
			{
				name: 'plugin-settings',
				title: __( 'General Settings', 'block-visibility' ),
				className: 'setting-tabs__plugin-settings',
			},
			{
				name: 'visibility-controls',
				title: __( 'Visibility Controls', 'block-visibility' ),
				className: 'setting-tabs__visibility-controls',
			},
			{
				name: 'block-manager',
				title: __( 'Block Manager', 'block-visibility' ),
				className: 'setting-tabs__blocks-manager',
			},
		];

		return applyFilters( 'blockVisibility.SettingTabs', tabs );
	}, [] );

	const { initialTab, updateUrl } = useTabNavigation( settingTabs );

	const currentSettings = useMemo(
		() => settings ?? settingsData.record,
		[ settings, settingsData.record ]
	);

	const renderTab = useCallback(
		( tab ) => {
			const commonProps = {
				settings: currentSettings,
				setSettings: onSetSettings,
				variables: variablesData.record,
			};

			switch ( tab.name ) {
				case 'visibility-controls':
					return (
						<>
							<Ads variables={ variablesData.record } />
							<VisibilityControls { ...commonProps } />
						</>
					);
				case 'block-manager':
					return (
						<>
							<Ads variables={ variablesData.record } />
							<BlockManager { ...commonProps } />
						</>
					);
				case 'plugin-settings':
					return (
						<>
							<Ads variables={ variablesData.record } />
							<PluginSettings { ...commonProps } />
						</>
					);
				default:
					return (
						<>
							<Slot name="SettingTabs" />
							<AdditionalSettingTabs
								tabName={ tab.name }
								{ ...commonProps }
							/>
						</>
					);
			}
		},
		[ currentSettings, onSetSettings, variablesData.record ]
	);

	// Display loading/error message while settings are being fetched.
	if ( ! settingsData.hasResolved || ! variablesData.hasResolved ) {
		return (
			<div className="loading-settings">
				<Spinner />
				<span className="description">
					{ __( 'Loading settings…', 'block-visibility' ) }
				</span>
			</div>
		);
	}

	return (
		<SlotFillProvider>
			<Masthead variables={ variablesData.record } />
			<TabPanel
				className={ classnames( {
					'setting-tabs': true,
					is_pro: variablesData.record?.is_pro,
				} ) }
				activeClass="active-tab"
				initialTabName={ initialTab }
				tabs={ settingTabs }
				onSelect={ updateUrl }
			>
				{ renderTab }
			</TabPanel>
			<Footer variables={ variablesData.record } />
		</SlotFillProvider>
	);
}

// URL-related logic for setting tabs.
function useTabNavigation( settingTabs ) {
	const urlParams = new URLSearchParams( window.location.search );
	const requestedTab = urlParams.get( 'tab' );
	const initialTab = useMemo(
		() =>
			findKey( settingTabs, [ 'name', requestedTab ] )
				? requestedTab
				: 'plugin-settings',
		[ settingTabs, requestedTab ]
	);

	const updateUrl = useCallback( ( tabName ) => {
		urlParams.set( 'tab', tabName );

		if ( history.pushState ) { // eslint-disable-line
			const newUrl =
				window.location.protocol +
				'//' +
				window.location.host +
				window.location.pathname +
				'?' +
				urlParams.toString() +
				window.location.hash;

			window.history.replaceState( { path: newUrl }, '', newUrl );
		} else {
			window.location.search = urlParams.toString();
		}
	}, [] );

	return { initialTab, updateUrl };
}

wp.domReady( () => {
	registerCoreBlocks();
	render(
		<Settings />,
		document.getElementById( 'block-visibility__plugin-settings' )
	);
} );
