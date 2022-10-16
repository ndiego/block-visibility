/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { DropdownMenu, ExternalLink } from '@wordpress/components';
import { info } from '@wordpress/icons';

/**
 * Renders the more information icon and the information popover
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function InformationPopover( props ) {
	const { message, subMessage, link, position } = props;
	const popoverPosition = position ?? 'middle left';

	return (
		<div className="information-popover">
			<DropdownMenu
				label={ __( 'More Information', 'block-visibility' ) }
				icon={ info }
				toggleProps={ {
					className: 'information-popover__button',
				} }
				popoverProps={ {
					className: 'information-popover__popover',
					focusOnMount: 'container',
					position: popoverPosition,
					noArrow: false,
				} }
			>
				{ () => (
					<>
						<p>{ message }</p>
						{ subMessage && <p>{ subMessage }</p> }
						{ link && (
							<ExternalLink href={ link }>
								{ __( 'Learn More', 'block-visibility' ) }
							</ExternalLink>
						) }
					</>
				) }
			</DropdownMenu>
		</div>
	);
}
