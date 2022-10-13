/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Button, Slot, ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Schedule from './schedule';
import InformationPopover from './../../utils/components/information-popover';

/**
 * Add the date/time vsibility controls
 *
 * @since 1.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function DateTime( props ) {
	const { enabledControls, controlSetAtts, setControlAtts } = props;
	const controlActive = enabledControls.some(
		( control ) => control.settingSlug === 'date_time' && control?.isActive
	);

	if ( ! controlActive  ) {
		return null;
	}

	const dateTime = controlSetAtts?.controls?.dateTime ?? {};
	const hideOnSchedules = dateTime?.hideOnSchedules ?? false;
	let schedules = dateTime?.schedules ?? [];

	if ( schedules.length === 0 ) {
		const defaultSchedule = {
			enable: true,
			start: '',
			end: '',
		};

		dateTime.schedules = [ defaultSchedule ];
		schedules = dateTime.schedules;
	}

	const addSchedule = () => {
		const newSchedules = [ ...schedules ];
		newSchedules.push( {
			enable: true,
			start: '',
			end: '',
		} );

		setControlAtts(
			'dateTime',
			assign( { ...dateTime }, { schedules: [ ...newSchedules ] } )
		);
	};

	return (
		<div className="control-panel-item date-time-control">
			<h3 className="control-panel-item__heading has-icon">
				<span>{ __( 'Date & Time', 'block-visibility' ) }</span>
				<InformationPopover
					message={ __(
						'The Date & Time control allows you to automatically schedule when the block should be visible on your website.',
						'block-visibility'
					) }
					link="https://www.blockvisibilitywp.com/knowledge-base/how-to-use-the-date-time-control/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					position="bottom center"
				/>
			</h3>
			<div className="visibility-control__help">
				{ sprintf(
					// Translators: Whether the block is hidden or visible.
					__(
						'%s the block if at least one schedule applies.',
						'block-visibility'
					),
					hideOnSchedules
						? __( 'Hide', 'block-visibility' )
						: __( 'Show', 'block-visibility' )
				) }
			</div>
			<div className="date-time-control__schedules">
				{ schedules.map( ( schedule, scheduleIndex ) => {
					return (
						<Schedule
							key={ scheduleIndex }
							dateTime={ dateTime }
							schedules={ schedules }
							scheduleIndex={ scheduleIndex }
							scheduleAtts={ schedule }
							hideOnSchedules={ hideOnSchedules }
							{ ...props }
						/>
					);
				} ) }
			</div>
			<div className="date-time-control__add-schedule">
				<Button onClick={ () => addSchedule() } isSecondary>
					{ __( 'Add schedule', 'block-visibility' ) }
				</Button>
			</div>
			<div className="date-time-control__hide-on-schedules">
				<ToggleControl
					label={ __(
						'Hide when schedules apply',
						'block-visibility'
					) }
					checked={ hideOnSchedules }
					onChange={ () =>
						setControlAtts(
							'dateTime',
							assign(
								{ ...dateTime },
								{ hideOnSchedules: ! hideOnSchedules }
							)
						)
					}
				/>
			</div>
			<Slot name="DateTimeControls" />
		</div>
	);
}