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
	SlotFillProvider,
	Slot,
	withFilters,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import Masthead from './masthead';
import Footer from './footer';
import GettingStarted from './getting-started';
import VisibilityControls from './visibility-controls';
import BlockManager from './block-manager';
import PluginSettings from './plugin-settings';

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

			const response = await fetch(
				`/wp-json/block-visibility/v1/${ route }`,
				{ method: 'GET' },
			);

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

		const newSettings = assign(
			{ ...settings },
			{ [ option ]: value }
		);

		const response = await fetch(
			'/wp-json/block-visibility/v1/settings',
			{
				method: 'POST',
				body: JSON.stringify( newSettings ),
				headers : {
				   'Content-Type': 'application/json',
				   'X-WP-Nonce': wpApiSettings.nonce, // Set in enqueue scripts
				}
			},
		);

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
						{ __(
							'Loading settings…',
							'block-visibility'
						) }
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

	// Switch the default settings tab based on the URL tad query
	const urlParams = new URLSearchParams( window.location.search );
	const requestedTab = urlParams.get( 'tab' );
	const initialTab = findKey( settingTabs, [ 'name', requestedTab ] )
		? requestedTab
		: 'plugin-settings';

	// Provides an entry point to slot in additional settings.
	const AdditionalSettings = withFilters(
		'blockVisibility.MainSettings'
	)( ( props ) => <></> );

	return (
		<SlotFillProvider>
			<AdditionalSettings/>
			<Masthead
				variables={ variables }
			/>
			<Slot name="belowMasthead"/>
			<TabPanel
				className="setting-tabs"
				activeClass="active-tab"
				initialTabName={ initialTab }
				tabs={ settingTabs }
			>
				{ ( tab ) => {
					switch ( tab.name ) {
						case 'getting-started':
							return (
								<GettingStarted
									variables={ variables }
								/>
							);
						case 'visibility-controls':
							return (
								<VisibilityControls
									saveStatus={ saveStatus }
									handleSettingsChange={
										handleSettingsChange
									}
									visibilityControls={
										settings.visibility_controls
									}
								/>
							);
						case 'block-manager':
							return (
								<BlockManager
									saveStatus={ saveStatus }
									handleSettingsChange={
										handleSettingsChange
									}
									disabledBlocks={ settings.disabled_blocks }
									pluginSettings={ settings.plugin_settings }
								/>
							);
						case 'plugin-settings':
							return (
								<PluginSettings
									saveStatus={ saveStatus }
									handleSettingsChange={
										handleSettingsChange
									}
									pluginSettings={ settings.plugin_settings }
								/>
							);
					}
				} }
			</TabPanel>
			<Footer
				variables={ variables }
			/>
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
