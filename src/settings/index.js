/**
 * External dependencies
 */
import { assign, findKey } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect, render } from '@wordpress/element';
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
import GettingStarted from './getting-started';
import VisibilityControls from './visibility-controls';
import BlockManager from './block-manager';
import PluginSettings from './plugin-settings';

// Provides an entry point to slot in additional settings. Must be placed
// outside of function to avoid unnecessary rerenders.
const AdditionalSettings = withFilters(
	'blockVisibility.MainSettings'
)( ( props ) => <></> ); // eslint-disable-line

/**
 * Renders the Block Visibility settings page
 *
 * @since 1.0.0
 */
function Settings() {
	const [ status, setStatus ] = useState( 'idle' );
	const [ saveStatus, setSaveStatus ] = useState( 'saved' );
	const [ settings, setSettings ] = useState( null );
	const [ variables, setVariables ] = useState( null );

	useEffect( () => {
		// Generic fetch function to retrieve settings and variables on render.
		async function fetchData( route, setData ) {
			setStatus( 'fetching' );

			// blockVisibilityHomeUrl is provided by wp_add_inline_script.
			const fetchUrl = `${ blockVisibilityRestUrl }block-visibility/v1/${ route }`; // eslint-disable-line
			const response = await fetch( fetchUrl, { method: 'GET' } ); // eslint-disable-line

			if ( response.ok ) {
				const data = await response.json();
				setData( data );
				setStatus( 'fetched' );
			} else {
				setStatus( 'error' );
			}
		}

		fetchData( 'settings', setSettings );
		fetchData( 'variables', setVariables );
	}, [] );

	// Handle all setting changes, and save to the database.
	// TODO: Move this function to its own file.
	async function handleSettingsChange( option, value ) {
		setSaveStatus( 'saving' );

		const newSettings = assign( { ...settings }, { [ option ]: value } );
		const fetchUrl = `${ blockVisibilityRestUrl }block-visibility/v1/settings`; // eslint-disable-line

		const response = await fetch( fetchUrl, { // eslint-disable-line
			method: 'POST',
			body: JSON.stringify( newSettings ),
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': wpApiSettings.nonce, // eslint-disable-line
			},
		} );

		if ( response.ok ) {
			const data = await response.json();
			setSettings( data );
			setSaveStatus( 'saved' );
		} else {
			setSaveStatus( 'error' );
		}
	}

	// Display loading/error message while settings are being fetched.
	if ( ! settings || ! variables || status !== 'fetched' ) {
		return (
			<>
				{ status === 'error' && (
					<div className="notice notice-error">
						<p>
							{ __(
								'Something went wrong when trying to load the Block Visibility settings. Try refreshing the page. If the error persists, please contact support.',
								'block-visibility'
							) }
						</p>
					</div>
				) }
				<div className="loading-settings">
					<Spinner />
					<span className="description">
						{ __( 'Loading settings…', 'block-visibility' ) }
					</span>
				</div>
			</>
		);
	}

	const settingTabs = [
		{
			name: 'getting-started',
			title: __( 'Getting Started', 'block-visibility' ),
			className: 'setting-tabs__getting-started',
		},
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

	applyFilters( 'blockVisibility.SettingTabs', settingTabs );

	// Switch the default settings tab based on the URL tad query
	const urlParams = new URLSearchParams( window.location.search );
	const requestedTab = urlParams.get( 'tab' );
	const initialTab = findKey( settingTabs, [ 'name', requestedTab ] )
		? requestedTab
		: 'plugin-settings';

	const updateUrl = ( tabName ) => {
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
	};

	return (
		<SlotFillProvider>
			<AdditionalSettings />
			<Masthead variables={ variables } />
			<TabPanel
				className="setting-tabs"
				activeClass="active-tab"
				initialTabName={ initialTab }
				tabs={ settingTabs }
				onSelect={ ( tabName ) => updateUrl( tabName ) }
			>
				{ ( tab ) => {
					switch ( tab.name ) {
						case 'getting-started':
							return <GettingStarted variables={ variables } />;
						case 'visibility-controls':
							return (
								<VisibilityControls
									settings={ settings }
									variables={ variables }
									saveStatus={ saveStatus }
									handleSettingsChange={
										handleSettingsChange
									}
								/>
							);
						case 'block-manager':
							return (
								<BlockManager
									settings={ settings }
									variables={ variables }
									saveStatus={ saveStatus }
									handleSettingsChange={
										handleSettingsChange
									}
								/>
							);
						case 'plugin-settings':
							return (
								<PluginSettings
									settings={ settings }
									variables={ variables }
									saveStatus={ saveStatus }
									handleSettingsChange={
										handleSettingsChange
									}
								/>
							);
						default:
							return <Slot name="SettingsTabs" />;
					}
				} }
			</TabPanel>
			<Footer variables={ variables } />
		</SlotFillProvider>
	);
}

wp.domReady( () => {
	registerCoreBlocks();
	render(
		<Settings />,
		document.getElementById( 'block-visibility-settings-container' )
	);
} );
