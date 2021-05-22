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
import InformationPopover from './../../../utils/information-popover';

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
		<div className="setting-tabs__settings-panel">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					<Icon icon={ icons.acf } />
					{ __( 'Advanced Custom Fields', 'block-visibility' ) }
				</span>
			</div>
			<div className="settings-panel__container">
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Enable the Advanced Custom Fields control.',
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
					<InformationPopover
						message={ __(
							'The Advanced Custom Fields (ACF) control allows you to conditionally display blocks, including ACF blocks, based on ACF fields. Visit the plugin Knowledge Base for more information.',
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/knowledge-base/how-to-use-the-advanced-custom-fields-control/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					/>
				</div>
			</div>
		</div>
	);
}
