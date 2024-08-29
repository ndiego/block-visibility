/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Disabled, ToggleControl } from '@wordpress/components';
import { Icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import links from './../../../utils/links';
import { woocommerce } from '../../../utils/icons';
import { InformationPopover } from './../../../components';

/**
 * Renders the WooCommerce control settings.
 *
 * @since 3.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function WooCommerce( props ) {
	const { variables, visibilityControls, setVisibilityControls } = props;
	const isActive = variables?.integrations?.woocommerce?.active ?? false;

	if ( ! isActive ) {
		return null;
	}

	// Manually set defaults, this ensures the main settings function properly
	const enable = visibilityControls?.woocommerce?.enable ?? true; // eslint-disable-line
	const enableVariablePricing = visibilityControls?.woocommerce?.enable_variable_pricing ?? true; // eslint-disable-line

	let variablePriceControl = (
		<ToggleControl
			label={ __( 'Enable variable pricing.', 'block-visibility' ) }
			checked={ enableVariablePricing }
			onChange={ () => {
				setVisibilityControls( {
					...visibilityControls,
					woocommerce: {
						...visibilityControls.woocommerce,
						enable_variable_pricing: ! enableVariablePricing,
					},
				} );
			} }
		/>
	);

	if ( ! enable ) {
		variablePriceControl = <Disabled>{ variablePriceControl }</Disabled>;
	}

	return (
		<div className="settings-panel">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					<Icon icon={ woocommerce } />
					{ __( 'WooCommerce', 'block-visibility' ) }
				</span>
			</div>
			<div className="settings-panel__container">
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Enable the WooCommerce control.',
							'block-visibility'
						) }
						checked={ enable }
						onChange={ () => {
							setVisibilityControls( {
								...visibilityControls,
								woocommerce: {
									...visibilityControls.woocommerce,
									enable: ! enable,
								},
							} );
						} }
					/>
					<InformationPopover
						message={ __(
							'The WooCommerce control allows you to conditionally display blocks based on a variety of store-related rules. This includes shopping cart contents, customer order history, and more.',
							'block-visibility'
						) }
						link={ links.settings.woocommerce }
					/>
				</div>
				<div className="settings-type__toggle has-info-popover subsetting">
					{ variablePriceControl }
					<InformationPopover
						message={ __(
							'For products with variable pricing, display each variable price separately in the WooCommerce control. Products without variable pricing display as usual.',
							'block-visibility'
						) }
						link={ links.settings.woocommerce }
					/>
				</div>
			</div>
		</div>
	);
}
