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
import { Spinner, TabPanel } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Masthead from './utils/masthead';
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
	const [ isAPILoaded, setIsAPILoaded ] = useState( false );
	const [ isAPISaving, setIsAPISaving ] = useState( false );
	const [ hasSaveError, setHasSaveError ] = useState( false );
	const [ settings, setSettings ] = useState( [] );

	useEffect( () => {
		// Here we are using the Backbone JavaScript Client
		// https://developer.wordpress.org/rest-api/using-the-rest-api/backbone-javascript-client/
		wp.api.loadPromise.then( () => {
			const allSettings = new wp.api.models.Settings();

			if ( isAPILoaded === false ) {
				allSettings.fetch().then( ( response ) => {
					setSettings( response.block_visibility_settings );
					setIsAPILoaded( true );
				} );
			}
		} );
	}, [] );

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
			name: 'visibility-controls',
			title: __( 'Visibility Controls', 'block-visibility' ),
			className: 'setting-tabs__visibility-controls',
		},
		{
			name: 'block-manager',
			title: __( 'Block Manager', 'block-visibility' ),
			className: 'setting-tabs__blocks-manager',
		},
		{
			name: 'plugin-settings',
			title: __( 'General Settings', 'block-visibility' ),
			className: 'setting-tabs__plugin-settings',
		},
	];

	// Switch the default settings tab based on the URL tad query
	const urlParams = new URLSearchParams( window.location.search );
	const requestedTab = urlParams.get( 'tab' );
	const initialTab = findKey( settingTabs, [ 'name', requestedTab ] )
		? requestedTab
		: 'getting-started';

	return (
		<>
			<Masthead />
			<TabPanel
				className="setting-tabs"
				activeClass="active-tab"
				initialTabName={ initialTab }
				tabs={ settingTabs }
			>
				{ ( tab ) => {
					// Don't load tabs if settings have not yet loaded
					if ( ! isAPILoaded ) {
						return (
							<div className="setting-tabs__loading-settings">
								<Spinner />
								<span className="description">
									{ __(
										'Loading settings…',
										'block-visibility'
									) }
								</span>
							</div>
						);
					}

					switch ( tab.name ) {
						case 'getting-started':
							return (
								<GettingStarted
									isAPISaving={ isAPISaving }
									hasSaveError={ hasSaveError }
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
		</>
	);
}

wp.domReady( () => {
	registerCoreBlocks();
	render(
		<Settings />,
		document.getElementById( 'block-visibility-settings-container' )
	);
} );
