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
import { Spinner, TabPanel, SlotFillProvider, Slot, withFilters } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Masthead from './masthead';
import Footer from './footer';
import GettingStarted from './getting-started';
import VisibilityControls from './visibility-controls';
import BlockManager from './block-manager';
import PluginSettings from './plugin-settings';

import { useFetch } from './../utils/data';

/**
 * Renders the Block Visibility settings page
 *
 * @since 1.0.0
 */
function Settings() {
	const [ isAPISaving, setIsAPISaving ] = useState( false );
	const [ hasSaveError, setHasSaveError ] = useState( false );
	const [ status, setStatus ] = useState( 'idle' );
	const [ settings, setSettings ] = useState( null );
	const [ variables, setVariables ] = useState( null );

	useEffect( () => {

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

	function handleSettingsChange( option, value ) {
		setIsAPISaving( true );
		setHasSaveError( false );

		const currentSettings = settings;

		const model = new wp.api.models.Settings( {
			block_visibility_settings: assign(
				{ ...currentSettings },
				{ [ option ]: value }
			),
		} );

		model.save().then(
			( response ) => {
				setSettings( response.block_visibility_settings );
				setIsAPISaving( false );
			},
			() => {
				setIsAPISaving( false );
				setHasSaveError( true );
			}
		);
	}

	const visibilityControls = settings.visibility_controls;
	const disabledBlocks = settings.disabled_blocks;
	const pluginSettings = settings.plugin_settings;

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
									isAPISaving={ isAPISaving }
									hasSaveError={ hasSaveError }
									handleSettingsChange={
										handleSettingsChange
									}
									visibilityControls={ visibilityControls }
								/>
							);
						case 'block-manager':
							return (
								<BlockManager
									isAPISaving={ isAPISaving }
									hasSaveError={ hasSaveError }
									handleSettingsChange={
										handleSettingsChange
									}
									disabledBlocks={ disabledBlocks }
									pluginSettings={ pluginSettings }
								/>
							);
						case 'plugin-settings':
							return (
								<PluginSettings
									isAPISaving={ isAPISaving }
									hasSaveError={ hasSaveError }
									handleSettingsChange={
										handleSettingsChange
									}
									pluginSettings={ pluginSettings }
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
