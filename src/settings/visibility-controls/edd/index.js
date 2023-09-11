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
import { edd } from './../../../utils/icons';
import { InformationPopover } from './../../../components';

/**
 * Renders the Easy Digital Downloads control settings.
 *
 * @since 3.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function EDD( props ) {
	const { variables, visibilityControls, setVisibilityControls } = props;
	const isActive = variables?.integrations?.edd?.active ?? false;

	if ( ! isActive ) {
		return null;
	}

	// Manually set defaults, this ensures the main settings function properly
	const enable = visibilityControls?.edd?.enable ?? true; // eslint-disable-line
	const enableVariablePricing = visibilityControls?.edd?.enable_variable_pricing ?? true; // eslint-disable-line

	let variablePriceControl = (
		<ToggleControl
			label={ __( 'Enable variable pricing.', 'block-visibility' ) }
			checked={ enableVariablePricing }
			onChange={ () => {
				setVisibilityControls( {
					...visibilityControls,
					edd: {
						...visibilityControls.edd,
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
					<Icon icon={ edd } />
					{ __(
						'Easy Digital Downloads (EDD)',
						'block-visibility'
					) }
				</span>
			</div>
			<div className="settings-panel__container">
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Enable the Easy Digital Downloads control.',
							'block-visibility'
						) }
						checked={ enable }
						onChange={ () => {
							setVisibilityControls( {
								...visibilityControls,
								edd: {
									...visibilityControls.edd,
									enable: ! enable,
								},
							} );
						} }
					/>
					<InformationPopover
						message={ __(
							'The Easy Digital Downloads control allows you to conditionally display blocks based on a variety of store-related rules. This includes shopping cart contents, customer order history, and more.',
							'block-visibility'
						) }
						link={ links.settingsEDD }
					/>
				</div>
				<div className="settings-type__toggle has-info-popover subsetting">
					{ variablePriceControl }
					<InformationPopover
						message={ __(
							'Display each variable price separately for downloads with variable pricing in the Easy Digital Downloads control. Downloads without variable pricing display as usual.',
							'block-visibility'
						) }
						link={ links.settingsEDD }
					/>
				</div>
			</div>
		</div>
	);
}
