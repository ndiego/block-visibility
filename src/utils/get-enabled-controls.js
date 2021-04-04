/**
 * External dependencies
 */
import { has, isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import icons from './icons';


export function getControls() {
    let controls = [
        {
            label: __( 'Hide Block', 'block-visibility' ),
            type: 'core',
            attributeSlug: 'hideBlock',
            settingSlug: 'hide_block',
        },
        {
            label: __( 'Date & Time', 'block-visibility' ),
            type: 'core',
            attributeSlug: 'dateTime',
            settingSlug: 'date_time',
        },
        {
            label: __( 'User Role', 'block-visibility' ),
            type: 'core',
            attributeSlug: 'userRole',
            settingSlug: 'visibility_by_role',
        },
        {
            label: __( 'Screen Size', 'block-visibility' ),
            type: 'core',
            attributeSlug: 'screenSize',
            settingSlug: 'screen_size',
        },
        {
            label: __( 'Query String', 'block-visibility' ),
            type: 'core',
            attributeSlug: 'queryString',
            settingSlug: 'query_string',
        },
        {
            label: __( 'WP Fusion', 'block-visibility' ),
            type: 'integration',
            attributeSlug: 'wpFusion',
            settingSlug: 'wp_fusion',
            icon: icons.wpFusion,
        },
    ];

    //filter controls

    return controls;
}


export default function getEnabledControls( settings, variables ) {
    const enabledControls = [];

    // Make sure we have plugin settings and variables.
    if (
        ! settings ||
        ! variables ||
        0 === settings.length ||
        0 === variables.length
    ) {
        return enabledControls;
    }

    let controls = getControls();

    const isPluginActive = ( plugin ) => {
        let isActive = false;

        if ( variables?.integrations ) {
            isActive = variables?.integrations[ plugin ]?.active ?? false;
        }

        return isActive;
    };

    // If the plugin that provides this control is not active, disable.
    controls.forEach( function ( control ) {
        if (
            'integration' === control.type &&
            ! isPluginActive( control.settingSlug )
        ) {
            controls = controls.filter( ( item ) =>
                item.settingSlug !== control.settingSlug
            );
        }
    } );

    const visibilityControls = settings?.visibility_controls ?? {};

    if ( ! isEmpty( visibilityControls ) ) {
        controls.forEach( function ( control ) {
            const hasControl = has( visibilityControls, control.settingSlug );

            // If the control does not exist, assume true.
            if ( ! hasControl ) {
                enabledControls.push( control );
            }

            // Check if the control is set, default to "true".
            if ( visibilityControls[ control.settingSlug ]?.enable ?? true ) {
                enabledControls.push( control );
            }
        } );
    }

    return enabledControls;
}
