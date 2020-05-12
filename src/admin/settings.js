/**
 * Internal dependencies
 */
import BlockManager from './block-manager';

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
	ToggleControl
} from '@wordpress/components';


class Settings extends Component {
	constructor() {
		super( ...arguments );

		this.changeOptions = this.changeOptions.bind( this );

		this.state = {
			isAPILoaded: false,
			isAPISaving: false,
			bv_disable_all_blocks: false,
            search: '',
		};
	}

	componentDidMount() {
		wp.api.loadPromise.then( () => {
			this.settings = new wp.api.models.Settings();
			
			console.log( this.settings );
			
			if ( false === this.state.isAPILoaded ) {
				this.settings.fetch().then( response => {
					this.setState({
						bv_disable_all_blocks: Boolean( response.bv_disable_all_blocks ),
						isAPILoaded: true
					});
				});
			}
		});
	}

	changeOptions( option, value ) {
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
		if ( ! this.state.isAPILoaded ) {
			return (
				<Placeholder>
					<Spinner/>
				</Placeholder>
			);
		}
		
        const {
            categories,
            blockTypes,
            
        } = this.props;
        
		//console.log( getBlockTypes() );
        //console.log( blockTypes );

		return (
			<>
					
                <BlockManager />
				

				<div className="codeinwp-main">
					<PanelBody
                        title="Category 1"
                    >
						<PanelRow>
							<ToggleControl
								label={ __( 'Disable All Blocks?' ) }
								help={ 'Would you like to track views of logged-in admin accounts?.' }
								checked={ this.state.bv_disable_all_blocks }
								onChange={ () => this.changeOptions( 'bv_disable_all_blocks', ! this.state.bv_disable_all_blocks ) }
							/>
						</PanelRow>
					</PanelBody>
				</div>
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