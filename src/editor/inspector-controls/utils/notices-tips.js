/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Notice } from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Helper function for printing a notice when all controls have been disabled
 * in the plugin settings.
 *
 * @since 1.6.0
 * @param {string} settingsUrl The url to the plugin settings
 * @return {string}		 Return the rendered JSX
 */
export function NoticeControlsDisabled( settingsUrl ) {
	return (
		<Notice status="warning" isDismissible={ false }>
			{ createInterpolateElement(
				__(
					'Looks like all Visibility Controls have been disabled. To control block visibility again, re-enable some <a>Visibility Controls</a>.',
					'block-visibility'
				),
				{
					a: (
						<a // eslint-disable-line
							href={ settingsUrl + '&tab=visibility-controls' }
							target="_blank"
							rel="noreferrer"
						/>
					),
				}
			) }
		</Notice>
	);
}

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

/**
 * Helper function for printing a notice when an incompatible block is selected.
 *
 * @since 2.0.0
 * @param {string} name The name of the current block
 * @return {string}          Return the rendered JSX
 */
export function NoticeIncompatibleBlock( name ) {
	// Currently only Legacy Widget block is incompatible, improve in future.
	const blockName =
		name.name === 'core/legacy-widget'
			? __( 'Legacy Widget', 'block-visibility' )
			: __( 'Current', 'block-visibility' );

	return (
		<Notice status="warning" isDismissible={ false }>
			<p>
				{ sprintf(
					// Translators: The current block name.
					__(
						'Unfortunately the %1$s block does not support custom attributes. Therefore it is not compatible with Block Visibility.',
						'block-visibility'
					),
					blockName
				) }
			</p>
			<p>
				{ sprintf(
					// Translators: The current block name.
					__(
						'As a workaround, wrap the %1$s block in a Group block. Then apply the desired visibility controls to the Group block.',
						'block-visibility'
					),
					blockName
				) }
			</p>
		</Notice>
	);
}
