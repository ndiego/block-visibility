/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Notice } from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Helper function for printing a notice when all controls have been disabled
 * at the block level.
 *
 * @since 1.6.0
 * @return {string} Return the rendered JSX
 */
export function NoticeBlockControlsDisabled() {
	return (
		<Notice status="warning" isDismissible={ false }>
			{ __(
				'All visibility controls have been disabled for this block. Add controls using the three dots icon above.',
				'block-visibility'
			) }
		</Notice>
	);
}