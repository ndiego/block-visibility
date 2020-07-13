/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, render } from '@wordpress/element';
import { registerCoreBlocks } from '@wordpress/block-library';
import { Spinner, TabPanel } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Masthead from './settings/masthead';
import GettingStarted from './settings/getting-started';
import VisibilityControls from './settings/visibility-controls';
import BlockManager from './settings/block-manager';
import PluginSettings from './settings/plugin-settings';

/**
 * Renders the Block Visibility settings page
 *
 * @since 1.0.0
 */
class Settings extends Component {
	constructor() {
		super( ...arguments );

		this.handleSettingsChange = this.handleSettingsChange.bind( this );

		this.state = {
			isAPILoaded: false,
			isAPISaving: false,
			hasSaveError: false,
			settings: [],
		};
	}

	componentDidMount() {
		// Here we are using the Backbone JavaScript Client
		// https://developer.wordpress.org/rest-api/using-the-rest-api/backbone-javascript-client/
		wp.api.loadPromise.then( () => {
			this.settings = new wp.api.models.Settings();

			if ( this.state.isAPILoaded === false ) {
				this.settings.fetch().then( ( response ) => {
					this.setState( {
						settings: response.block_visibility_settings,
						isAPILoaded: true,
					} );
				} );
			}
		} );
	}

	handleSettingsChange( option, value ) {
		this.setState( {
			isAPISaving: true,
			hasSaveError: false,
		} );

		const currentSettings = this.state.settings;

		const model = new wp.api.models.Settings( {
			block_visibility_settings: assign(
				{ ...currentSettings },
				{ [ option ]: value }
			),
		} );

		model.save().then(
			( response ) => {
				this.setState( {
					settings: response.block_visibility_settings,
					isAPISaving: false,
				} );
			},
			() => {
				this.setState( {
					isAPISaving: false,
					hasSaveError: true,
				} );
			}
		);
	}

	render() {
		const isAPILoaded = this.state.isAPILoaded;
		const isAPISaving = this.state.isAPISaving;
		const hasSaveError = this.state.hasSaveError;

		const visibilityControls = this.state.settings.visibility_controls;
		const disabledBlocks = this.state.settings.disabled_blocks;
		const pluginSettings = this.state.settings.plugin_settings;

		const settingTabs = [
			{
				name: 'getting-started',
				title: __( 'Getting Started', 'block-visibility' ),
				className: 'bv-settings__getting-started',
			},
			{
				name: 'visibility-controls',
				title: __( 'Visibility Controls', 'block-visibility' ),
				className: 'bv-settings__visibility-controls',
			},
			{
				name: 'block-manager',
				title: __( 'Block Manager', 'block-visibility' ),
				className: 'bv-settings__blocks-manager',
			},
			{
				name: 'plugin-settings',
				title: __( 'Settings', 'block-visibility' ),
				className: 'bv-settings__plugin-settings',
			},
		];

		return (
			<>
				<Masthead />
				<TabPanel
					className="bv-tab-panel"
					activeClass="active-tab"
					initialTabName="getting-started"
					tabs={ settingTabs }
				>
					{ ( tab ) => {
						// Don't load tabs if settings have not yet loaded
						if ( ! isAPILoaded ) {
							return (
								<div className="bv-loading-settings">
									<Spinner />
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
											this.handleSettingsChange
										}
										visibilityControls={
											visibilityControls
										}
									/>
								);
							case 'block-manager':
								return (
									<BlockManager
										isAPISaving={ isAPISaving }
										hasSaveError={ hasSaveError }
										handleSettingsChange={
											this.handleSettingsChange
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
											this.handleSettingsChange
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
}

wp.domReady( () => {
	registerCoreBlocks();
	render( <Settings />, document.getElementById( 'bv-settings-container' ) );
} );
