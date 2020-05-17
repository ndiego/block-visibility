/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose, withState } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { Component, render } from '@wordpress/element';
import { BlockIcon } from '@wordpress/block-editor';
import { registerCoreBlocks } from '@wordpress/block-library';
import { getBlockTypes, getCategories } from '@wordpress/blocks';
import {
	Button,
	ExternalLink,
	PanelBody,
	PanelRow,
	Placeholder,
	Spinner,
	ToggleControl,
	TabPanel
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import Masthead from './settings/masthead';
import GettingStarted from './settings/getting-started';
import BlockManager from './settings/block-manager';


class Settings extends Component {
	constructor() {
		super( ...arguments );

		this.handSettingsChange = this.handSettingsChange.bind( this );

		this.state = {
			isAPILoaded: false,
			isAPISaving: false,
			disabledBlocks: [],
		};
	}

	componentDidMount() {
		wp.api.loadPromise.then( () => {
			this.settings = new wp.api.models.Settings();
			
			//console.log( this.settings );
			
			if ( false === this.state.isAPILoaded ) {
				this.settings.fetch().then( response => {
					this.setState( {
						disabledBlocks: response.bv_disabled_blocks,
						isAPILoaded: true
					} );
				});
			}
		});
	}

	handSettingsChange( option, value ) {
		this.setState({ isAPISaving: true });

		const model = new wp.api.models.Settings({
			// eslint-disable-next-line camelcase
			[option]: value
		});

		model.save().then( response => {
			this.setState({
				[option]: response[option],
				isAPISaving: false
			});
		});
	}

	render() {


        const {
            categories,
            blockTypes,
        } = this.props;
        
		//console.log( this.state.disabledBlocks );

		const disabledBlocks = this.state.disabledBlocks;
		
		const settingTabs = [
			{
				name: 'bv-getting-started',
				title: __( 'Getting Started', 'block-visibility' ),
				className: 'bv-settings-getting-started',
			},
			{
				name: 'bv-functionality-manager',
				title: __( 'Functionality Manager', 'block-visibility' ),
				className: 'bv-settings-functionality-manager',
			},
			{
				name: 'bv-block-manager',
				title: __( 'Block Manager', 'block-visibility' ),
				className: 'bv-settings-blocks-manager',
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
					initialTabName="bv-getting-started"
					tabs={ settingTabs }
				>
					{
						( tab ) => {
							// Don't load tabs is settings have not yet loaded
							if ( ! this.state.isAPILoaded ) {
								return (
									<div className="bv-settings-loading">
										<Spinner/>
									</div>
								);
							}
							
							switch ( tab.name ) {
								case 'bv-getting-started':
									return (
										<GettingStarted
											isAPISaving={ this.state.isAPISaving }
										/>
									);

								case 'bv-functionality-manager':
									return (
										<div className="bv-functionality-manager">
											Functionality Content
										</div>
									);

								case 'bv-block-manager':
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