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
import VisibilitySettings from './settings/visibility-settings';
import BlockManager from './settings/block-manager';
import { snakeToCamel } from './utils/utility-functions';


class Settings extends Component {
	constructor() {
		super( ...arguments );

		this.handleSettingsChange = this.handleSettingsChange.bind( this );

		this.state = {
			isAPILoaded: false,
			isAPISaving: false,
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
						isAPILoaded: true
					} );
				});
			}
		});
	}

	handleSettingsChange( option, value ) {
		this.setState( { isAPISaving: true } );
		
		const currentSettings = this.state.settings;

		const model = new wp.api.models.Settings( {
			'block_visibility_settings': assign(
				{ ...currentSettings },
				{ [option]: value }
			)
		} );

		model.save().then( ( response ) => {			
			this.setState( {
				settings: response.block_visibility_settings,
				isAPISaving: false
			} );
		} );
	}

	render() {

		console.log( this.state.settings );
		
		const settingTabs = [
			{
				name: 'getting-started',
				title: __( 'Getting Started', 'block-visibility' ),
				className: 'bv-settings__getting-started',
			},
			{
				name: 'visibility-settings',
				title: __( 'Visibility Settings', 'block-visibility' ),
				className: 'bv-settings__visibility-settings',
			},
			{
				name: 'block-manager',
				title: __( 'Block Manager', 'block-visibility' ),
				className: 'bv-settings__blocks-manager',
			},
		];
		
		const isAPISaving = this.state.isAPISaving;
		const isAPILoaded = this.state.isAPILoaded;
		
		const visibilitySettings = this.state.settings.visibility_settings;
		const disabledBlocks = this.state.settings.disabled_blocks;
		
		return (
			<>
				<Masthead
					isAPISaving={ isAPISaving }
				/>
				<TabPanel 	
					className="bv-tab-panel"
					activeClass="active-tab"
					initialTabName="visibility-settings"
					//initialTabName="getting-started"
					tabs={ settingTabs }
				>
					{
						( tab ) => {
							// Don't load tabs if settings have not yet loaded
							if ( ! isAPILoaded ) {
								return (
									<div className="bv-loading-settings">
										<Spinner/>
									</div>
								);
							}
							
							switch ( tab.name ) {
								case 'getting-started':
									return (
										<GettingStarted
											isAPISaving={ isAPISaving }
										/>
									);

								case 'visibility-settings':
									return (
										<VisibilitySettings
											isAPISaving={ isAPISaving }
											handleSettingsChange={ this.handleSettingsChange }
											visibilitySettings={ visibilitySettings }
										/>
									);

								case 'block-manager':
									return (
										<BlockManager
											isAPISaving={ isAPISaving }
											handleSettingsChange={ this.handleSettingsChange }
											disabledBlocks={ disabledBlocks }
										/>
									);
							}
						}
					}
				</TabPanel>
			</>
		);
	}
}

wp.domReady( () => {
	registerCoreBlocks();
	render(
		<Settings />,
		document.getElementById( 'bv-settings-container' )
	);
} );