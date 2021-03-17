/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
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
                            href={ settingsUrl }
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
 * @return {string}		 Return the rendered JSX
 */
export function NoticeBlockControlsDisabled() {
    return (
        <Notice status="warning" isDismissible={ false }>
            { __(
                'All visibility controls have been disabled for this block. Add controls using the ellipsis icon above.',
                'block-visibility'
            ) }
        </Notice>
    );
}

/**
 * Helper function for printing a notice that alerts admin users on how to
 * customize the control settings.
 *
 * @since 1.6.0
 * @param {string} settingsUrl The url to the plugin settings
 * @return {string}		 Return the rendered JSX
 */
export function NoticeCustomizeControls( settingsUrl ) {
    return (
        <Notice status="notice" isDismissible={ false }>
            { createInterpolateElement(
                __(
                    'Customize and restrict visibility controls in the <a>plugin settings</a>.',
                    'block-visibility'
                ),
                {
                    a: (
                        <a // eslint-disable-line
                            href={
                                settingsUrl +
                                '&tab=visibility-controls'
                            }
                            target="_blank"
                            rel="noreferrer"
                        />
                    ),
                }
            ) }
            <span className="visibility-control__help">
                { __(
                    'Notice only visible to Administrators.',
                    'block-visibility'
                ) }
            </span>
        </Notice>
    );
}
