/**
 * External dependencies
 */
import { CopyToClipboard } from 'react-copy-to-clipboard';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { MenuItem } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Render the copy visibility attributes menu button.
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function CopyButton( props ) {
	const { canResetAll, controlSetAtts } = props;
	const visibilityAtts = controlSetAtts?.controls ?? '';
	let copiedText = '';

	if ( visibilityAtts ) {
		copiedText = JSON.stringify( visibilityAtts );
	}

	const { createSuccessNotice } = useDispatch( noticesStore );
	const copyNotice = __(
		'Copied visibility controls to clipboard.',
		'block-visibility'
	);
	const copyError = __(
		'Nothing to copy. Current block has no configured visibility controls.',
		'block-visibility'
	);
	const notice = visibilityAtts ? copyNotice : copyError;

	if ( canResetAll ) {
		return (
			<CopyToClipboard text={ copiedText }>
				<MenuItem
					aria-disabled={ ! canResetAll }
					onClick={ () =>
						createSuccessNotice( notice, { type: 'snackbar' } )
					}
				>
					{ __( 'Copy', 'block-visibility' ) }
				</MenuItem>
			</CopyToClipboard>
		);
	}

	return (
		<MenuItem aria-disabled>{ __( 'Copy', 'block-visibility' ) }</MenuItem>
	);
}
