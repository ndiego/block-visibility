/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Popover, Button, ExternalLink } from '@wordpress/components';
import { Icon, info } from '@wordpress/icons';

/**
 * Renders the more information icon and the information popover
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function InformationPopover( props ) {
	const [ popoverVisible, setPopoverVisible ] = useState( false );
	const { message, subMessage, link, position } = props;
	const popoverPosition = position ?? 'bottom center';

	return (
		<div className="information-popover">
			<Button
				className="information-popover__button"
				onClick={ () => setPopoverVisible( ! popoverVisible ) }
			>
				<Icon icon={ info } />
			</Button>
			{ popoverVisible && (
				<Popover
					className="information-popover__popover"
					position={ popoverPosition }
					focusOnMount="container"
					onFocusOutside={ () =>
						setPopoverVisible( ! popoverVisible )
					}
				>
					<p>{ message }</p>
					{ subMessage && <p>{ subMessage }</p> }
					{ link && (
						<ExternalLink href={ link }>
							{ __( 'Learn More', 'block-visibility' ) }
						</ExternalLink>
					) }
				</Popover>
			) }
		</div>
	);
}
