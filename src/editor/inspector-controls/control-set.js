/**
 * External dependencies
 */
import { assign, isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { Slot, withFilters } from '@wordpress/components';

/**
 * Internal dependencies
 */
import ControlSetToolbar from './control-set-toolbar';
import UserRole from './user-role';
import DateTime from './date-time';
import ScreenSize from './screen-size';
import QueryString from './query-string';
import WPFusion from './wp-fusion';
import { NoticeBlockControlsDisabled } from './utils/notices-tips';

/**
 * Render a control set
 *
 * @since 1.6.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function ControlSet( props ) {
	const {
		setAttributes,
		variables,
		enabledControls,
		blockAtts,
		controlSetAtts,
	} = props;
	const settingsUrl = variables?.pluginVariables?.settingsUrl ?? '';
	const noControls =
		enabledControls.length === 1 &&
		enabledControls.includes( 'hide_block' );

	if ( noControls ) {
		return null;
	}

	function setControlAtts( control, values ) {
		controlSetAtts.controls[ control ] = values;

		blockAtts.controlSets[ controlSetAtts.id ] = controlSetAtts;

		setAttributes( {
			blockVisibility: assign(
				{ ...blockAtts },
				{ controlSets: blockAtts.controlSets }
			),
		} );
	}

	// Provides an entry point to slot in additional settings.
	const AdditionalControlSetControls = withFilters(
		'blockVisibility.addControlSetControls'
	)( ( props ) => <></> ); // eslint-disable-line

	return (
		<div className="block-visibility__control-set">
			<ControlSetToolbar { ...props } />

			<Slot name="ControlSetControlsTop" />

			<DateTime setControlAtts={ setControlAtts } { ...props } />
			<UserRole setControlAtts={ setControlAtts } { ...props } />
			<ScreenSize setControlAtts={ setControlAtts } { ...props } />
			<QueryString setControlAtts={ setControlAtts } { ...props } />

			<Slot name="ControlSetControlsMiddle" />

			<WPFusion setControlAtts={ setControlAtts } { ...props } />

			<Slot name="ControlSetControlsBottom" />

			<AdditionalControlSetControls
				setControlAtts={ setControlAtts }
				{ ...props }
			/>
			{ ! noControls && isEmpty( controlSetAtts.controls ) && (
				<NoticeBlockControlsDisabled settingsUrl={ settingsUrl } />
			) }
		</div>
	);
}
