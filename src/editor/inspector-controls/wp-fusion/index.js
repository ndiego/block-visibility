/**
 * External dependencies
 */
import { assign } from 'lodash';
import Select from 'react-select';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { ToggleControl, Slot, Disabled, Notice } from '@wordpress/components';
import { Icon, info } from '@wordpress/icons';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { isControlSettingEnabled } from './../../utils/setting-utilities';
import icons from './../../../utils/icons';

/**
 * Add the screen size vsibility controls
 * (Could use refactoring)
 *
 * @since 1.5.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function WPFusion( props ) {
	const { settings, variables, enabledControls, controlSetAtts, setControlAtts } = props;

    console.log( controlSetAtts );

	const controlEnabled = enabledControls.includes( 'wp_fusion' );
	const controlToggledOn =
		controlSetAtts?.controls.hasOwnProperty( 'wpFusion' ) ?? false;

	if ( ! controlEnabled || ! controlToggledOn ) {
		return null;
	}
    const hasUserRoles =
		controlSetAtts?.controls.hasOwnProperty( 'userRole' ) ?? false;
    const userRoles =
        controlSetAtts?.controls?.userRole?.visibilityByRole ?? 'public';
    const hideAnyAll = userRoles === 'public' || userRoles === 'logged-out';

    console.log( hasUserRoles );

    const availableTags = variables?.integrations?.wpFusion?.tags ?? [];

    const convertTags = ( tags ) => {
        const selectedTags = availableTags.filter(
            ( tag ) => tags.includes( tag.value )
        );
        return selectedTags;
    }

	const wpFusion = controlSetAtts?.controls?.wpFusion ?? {};
	const tagsAny = convertTags( wpFusion?.tagsAny ?? [] );
    const tagsAll = convertTags( wpFusion?.tagsAll ?? [] );
    const tagsNot = convertTags( wpFusion?.tagsNot ?? [] );

    const handleOnChange = ( attribute, tags ) => {
		let newTags = [];

		if ( tags.length != 0 ) {
			tags.forEach( ( tag ) => {
				newTags.push( tag.value );
			} );
		}
        console.log( newTags );
        setControlAtts(
            'wpFusion',
            assign(
                { ...wpFusion },
                { [ attribute ]: newTags },
            )
        );
	}

    let anyAllFields = (
        <>
            <div className="visibility-control wp-fusion__tags-any">
                <div className="visibility-control__label">
                    { __( 'Required Tags (Any)', 'block-visibility' ) }
                </div>
                <Select
                   className="block-visibility__react-select"
                   classNamePrefix="react-select"
                   options={ availableTags }
                   value={ tagsAny }
                   onChange={ ( value ) => handleOnChange( 'tagsAny', value ) }
                   isMulti
                />
                <div className="visibility-control__help">
                    { __(
                        'Only visible to logged-in users with at least one of the selected tags.',
                        'block-visibility'
                    ) }
                </div>
            </div>
            <div className="visibility-control wp-fusion__tags-all">
                <div className="visibility-control__label">
                    { __( 'Required Tags (All)', 'block-visibility' ) }
                </div>
                <Select
                    className="block-visibility__react-select"
                    classNamePrefix="react-select"
                    options={ availableTags }
                    value={ tagsAll }
                    onChange={ ( value ) => handleOnChange( 'tagsAll', value ) }
                    isMulti
                />
                <div className="visibility-control__help">
                    { createInterpolateElement(
                        __(
                            'Only visible to logged-in users with <strong>all</strong> selected tags.',
                            'block-visibility'
                        ),
                        {
                            strong: <strong />,
                        }
                    ) }
                </div>
            </div>
        </>
    );

    if ( userRoles === 'public' || userRoles === 'logged-out' ) {
        anyAllFields = <Disabled>{ anyAllFields }</Disabled>;
    }

    let notField = (
        <div className="visibility-control wp-fusion__tags-not">
            <div className="visibility-control__label">
                { __( 'Required Tags (Not)', 'block-visibility' ) }
            </div>
            <Select
                className="block-visibility__react-select"
                classNamePrefix="react-select"
                options={ availableTags }
                value={ tagsNot }
                onChange={ ( value ) => handleOnChange( 'tagsNot', value ) }
                isMulti
            />
            <div className="visibility-control__help">
                { __(
                    'Hide from logged-in users with at least one of the selected tags.',
                    'block-visibility'
                ) }
            </div>
        </div>
    );

    if ( userRoles === 'logged-out' ) {
        notField = <Disabled>{ notField }</Disabled>;
    }

	return (
		<div className="visibility-control__group wp-fusion-control">
			<h3 className="visibility-control__group-heading has-icon">
				<span>{ __( 'WP Fusion', 'block-visibility' ) }</span>
                <Icon icon={ icons.wpFusion } />
			</h3>
            <div className="visibility-control__help">
                { __(
                    'Configure block visibility based on WP Fusion tags. The available fields depend on the User Role control settings.',
                    'block-visibility'
                ) }
            </div>
            { anyAllFields }
            { notField }
			<Slot name="WPFusionControls" />
            { ! hasUserRoles && (
                <Notice status="warning" isDismissible={ false }>
                    { __(
                        'The WP Fusion control works best in coordination with the User Role control. To re-enable, click the ellipsis icon above.',
                        'block-visibility'
                    ) }
                </Notice>
            ) }
		</div>
	);
}
