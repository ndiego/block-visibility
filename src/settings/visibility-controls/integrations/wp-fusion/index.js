/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToggleControl } from '@wordpress/components';
import { Icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import icons from './../../../../utils/icons';

/**
 * Renders the Wp Fusion control settings.
 *
 * @since 1.8.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function WPFusion( props ) {
	const {
		variables,
		visibilityControls,
		setVisibilityControls,
		setHasUpdates,
	} = props;
	const wpFusionActive = variables?.integrations?.wp_fusion?.active ?? false;

	if ( ! wpFusionActive ) {
		return null;
	}

	// Manually set defaults, this ensures the main settings function properly
	const enable = visibilityControls?.wp_fusion?.enable ?? true; // eslint-disable-line

	return (
		<>
			<div className="settings-label">
				<span>{ __( 'WP Fusion', 'block-visibility' ) }</span>
				<Icon icon={ icons.wpFusion } />
			</div>
			<div className="settings-type__toggle has-info-popover">
				<ToggleControl
					label={ __(
						'Enable the WP Fusion control.',
						'block-visibility'
					) }
					checked={ enable }
					onChange={ () => {
						setVisibilityControls( {
							...visibilityControls,
							wp_fusion: {
								...visibilityControls.wp_fusion,
								enable: ! enable,
							},
						} );
						setHasUpdates( true );
					} }
				/>
			</div>
		</>
	);
}
