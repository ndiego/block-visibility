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
 * Renders the ACF control settings.
 *
 * @since 1.8.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function ACF( props ) {
	const {
		variables,
		visibilityControls,
		setVisibilityControls,
		setHasUpdates,
	} = props;
	const acfActive = variables?.integrations?.acf?.active ?? false;

	if ( ! acfActive ) {
		return null;
	}

	// Manually set defaults, this ensures the main settings function properly
	const enable = visibilityControls?.acf?.enable ?? true; // eslint-disable-line

	return (
		<>
			<div className="settings-label">
				<span>{ __( 'Advaced Custom Fields', 'block-visibility' ) }</span>
				<Icon icon={ icons.acf } />
			</div>
			<div className="settings-type__toggle has-info-popover">
				<ToggleControl
					label={ __(
						'Enable the Advanced Custom Fields (ACF) control.',
						'block-visibility'
					) }
					checked={ enable }
					onChange={ () => {
						setVisibilityControls( {
							...visibilityControls,
							acf: {
								...visibilityControls.acf,
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
