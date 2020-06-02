
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import {
    Popover,
    Button
} from '@wordpress/components';
import { Icon, info } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import icons from './../icons';

function InformationPopover( props ) {
    
    const [ popoverVisible, setPopoverVisible ] = useState( false );
    
    const {
        message,
        position
    } = props;
    
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
                    onFocusOutside={ () => setPopoverVisible( ! popoverVisible ) }
                >
                    { message }
                </Popover>
            ) }
        </div>
    );
}
export default InformationPopover;