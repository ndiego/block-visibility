/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { ToggleControl } from '@wordpress/components';
import { Icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import RuleSets from './rule-sets';
import icons from './../../../utils/icons';
import ControlSeparator from './../utils/control-separator';

/**
 * Add the ACF controls
 *
 * @since 1.8.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function ACF( props ) {
	const {
		variables,
		enabledControls,
		controlSetAtts,
		setControlAtts,
	} = props;
	const pluginActive = variables?.integrations?.acf?.active ?? false;
	const controlEnabled = enabledControls.some(
		( control ) => control.settingSlug === 'acf'
	);
	const controlToggledOn =
		controlSetAtts?.controls.hasOwnProperty( 'acf' ) ?? false;

	if ( ! controlEnabled || ! controlToggledOn || ! pluginActive ) {
		return null;
	}

	const acf = controlSetAtts?.controls?.acf ?? {};
	const hideOnRuleSets = acf?.hideOnRuleSets ?? false;

	return (
		<>
			<div className="visibility-control__group acf-control">
				<h3 className="visibility-control__group-heading has-icon">
					<span>
						{ __( 'Advanced Custom Fields', 'block-visibility' ) }
					</span>
					<Icon icon={ icons.acf } />
				</h3>
				<div className="visibility-control__label">
					{ sprintf(
						// Translators: Whether the block is hidden or visible.
						__( '%s the block if:', 'block-visibility' ),
						hideOnRuleSets
							? __( 'Hide', 'block-visibility' )
							: __( 'Show', 'block-visibility' )
					) }
				</div>
				<RuleSets acf={ acf } { ...props } />
				<div className="acf-control__hide-on-rule-sets">
					<ToggleControl
						label={ __(
							'Hide when rules apply',
							'block-visibility'
						) }
						checked={ hideOnRuleSets }
						onChange={ () =>
							setControlAtts(
								'acf',
								assign(
									{ ...acf },
									{ hideOnRuleSets: ! hideOnRuleSets }
								)
							)
						}
						help={ __(
							'Alternatively, hide the block when the applied rules are satisfied.',
							'block-visibility'
						) }
					/>
				</div>
			</div>
			<ControlSeparator control="acf" { ...props } />
		</>
	);
}
