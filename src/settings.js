/**
 * External dependencies
 */

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
			generalSettings: [],
			disabledFunctionality: [],
			disabledBlocks: [],
		};
	}

	componentDidMount() {
		// Here we are using the Backbone JavaScript Client
		// https://developer.wordpress.org/rest-api/using-the-rest-api/backbone-javascript-client/
		wp.api.loadPromise.then( () => {
			this.settings = new wp.api.models.Settings();
						
			if ( this.state.isAPILoaded === false ) {
				this.settings.fetch().then( ( response ) => {
					const settings = response.block_visibility_settings;
										
					this.setState( {
						generalSettings: settings.general_settings,
						disabledFunctionality: settings.disabled_functionality,
						disabledBlocks: settings.disabled_blocks,
						isAPILoaded: true
					} );
				});
			}
		});
	}

	handleSettingsChange( option, value ) {
		this.setState( { isAPISaving: true } );

		const model = new wp.api.models.Settings( {
			'block_visibility_settings': {
				[option]: value
			}
		} );

		model.save().then( ( response ) => {
			const settings = response.block_visibility_settings;
			const optionState = snakeToCamel( option );
			
			this.setState( {
				[optionState]: settings[option],
				isAPISaving: false
			} );
		} );
	}

	render() {
		const disabledBlocks = this.state.disabledBlocks;
		
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
		
		return (
			<>
				<Masthead
					isAPISaving={ this.state.isAPISaving }
				/>
				<TabPanel 	
					className="bv-tab-panel"
					activeClass="active-tab"
					initialTabName="getting-started"
					tabs={ settingTabs }
				>
					{
						( tab ) => {
							// Don't load tabs is settings have not yet loaded
							if ( ! this.state.isAPILoaded ) {
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
											isAPISaving={ this.state.isAPISaving }
										/>
									);

								case 'visibility-settings':
									return (
										<VisibilitySettings
											isAPISaving={ this.state.isAPISaving }
										/>
									);

								case 'block-manager':
									return (
										<BlockManager
											isAPILoaded={ this.state.isAPILoaded }
											isAPISaving={ this.state.isAPISaving }
											handSettingsChange={ this.handSettingsChange }
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