/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
	BaseControl,
	Button,
	ExternalLink,
	PanelBody,
	PanelRow,
	Placeholder,
	Spinner,
	ToggleControl
} = wp.components;

const {
	render,
	Component,
} = wp.element;

class Settings extends Component {
	constructor() {
		super( ...arguments );

		this.changeOptions = this.changeOptions.bind( this );

		this.state = {
			isAPILoaded: false,
			isAPISaving: false,
			bv_disable_all_blocks: false,
		};
	}

	componentDidMount() {
		wp.api.loadPromise.then( () => {
			this.settings = new wp.api.models.Settings();

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

		return (
			<>
				<div className="codeinwp-header">
					<div className="codeinwp-container">
						<div className="codeinwp-logo">
							<h1>{ __( 'My Awesome Plugin' ) }</h1>
						</div>
					</div>
				</div>

				<div className="codeinwp-main">
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

render(
	<App/>,
	document.getElementById( 'bv-settings-container' )
);