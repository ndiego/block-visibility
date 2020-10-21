import { registerPlugin } from '@wordpress/plugins';
import { PluginBlockSettingsMenuItem } from '@wordpress/edit-post';

const ToggleHideBlock = ( props ) => (
    <PluginBlockSettingsMenuItem
        allowedBlocks={ [ 'core/paragraph' ] }
        label="Menu item text"
        onClick={ () => {
            alert( 'clicked' );
            console.log( props );
        } }
    />
);


registerPlugin( 'block-visibility-hide-block', {
    icon: 'visibility',
    render: ToggleHideBlock,
} );
