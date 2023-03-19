/**
 * External dependencies
 */
import { without } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { CheckboxControl, Tooltip } from '@wordpress/components';

const daysOfTheWeek = [
	{
		index: 1,
		slug: 'Sun',
		title: __( 'Sunday', 'block-visibility' ),
	},
	{
		index: 2,
		slug: 'Mon',
		title: __( 'Monday', 'block-visibility' ),
	},
	{
		index: 3,
		slug: 'Tue',
		title: __( 'Tuesday', 'block-visibility' ),
	},
	{
		index: 4,
		slug: 'Wed',
		title: __( 'Wednesday', 'block-visibility' ),
	},
	{
		index: 5,
		slug: 'Thu',
		title: __( 'Thursday', 'block-visibility' ),
	},
	{
		index: 6,
		slug: 'Fri',
		title: __( 'Friday', 'block-visibility' ),
	},
	{
		index: 7,
		slug: 'Sat',
		title: __( 'Saturday', 'block-visibility' ),
	},
];

/**
 * Add the restrict by Day of Week block control
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function DayOfWeek( props ) {
	const { scheduleAtts, setAttribute } = props;
	const restrictedDays = scheduleAtts?.dayOfWeek?.days ?? [];

	return (
		<div className="schedules-item__fields__day-of-week">
			<div className="control-fields-item__label">
				{ __( 'On these days', 'block-visibility' ) }
			</div>
			<div className="day-of-week__checkbox-controls">
				{ daysOfTheWeek.map( ( day ) => (
					<CheckboxControl
						key={ day.index }
						label={
							<Tooltip text={ day.title }>
								<span aria-label={ day.title }>
									{ day.title.charAt( 0 ) }
								</span>
							</Tooltip>
						}
						checked={ restrictedDays.includes( day.slug ) }
						onChange={ ( checked ) => {
							let days = [ ...restrictedDays ];

							if ( checked ) {
								days.push( day.slug );
							} else {
								days = without( days, day.slug );
							}

							setAttribute( 'dayOfWeek', 'days', days );
						} }
					/>
				) ) }
			</div>
		</div>
	);
}
