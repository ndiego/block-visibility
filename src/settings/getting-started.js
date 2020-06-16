/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { __experimentalCreateInterpolateElement } from '@wordpress/element';
import {
	Button,
	ExternalLink,
	PanelBody,
	PanelRow,
	Placeholder,
	ToggleControl
} from '@wordpress/components';
import { Icon, cloud } from '@wordpress/icons';

/**
 * Renders the Getting Started tab of the Block Visibility settings page
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function GettingStarted( props ) {
    const { isAPISaving } = props;
    
    return (
		<div className="bv-getting-started inner-container">
			<div className="bv-tab-panel__description">
				<h2>{ __( 'Welcome', 'block-visibility' ) }</h2>
				<p>
					{ __( 
						'Thank you for choosing Block Visibility. As the name suggests, this plugin allows you to easily control the visibility of blocks in the WordPress editor. To get started, watch the quick video below for an overview of how the plugin works. You will become a master in no time!',
						'block-visibility'
					) }
				</p>
			</div>
			<div className="bv-getting-started__video">
				video goes here
			</div>
			<div className="bv-getting-started__details">
				<h2>{ __( 'How does it work?', 'block-visibility' ) }</h2>
				<p>
					{ __( 
						'The Block Visibility plugin is designed exclusively for the Block Editor and does not work in the Classic Editor. So long as you are running the latest version of WordPress and are not utilizing the Classic Editor plugin, you are good to go!',
						'block-visibility'
					) }
				</p>
				<p>
					{ __experimentalCreateInterpolateElement(
						__( 
							'By default, this plugin adds a Visibility panel to the  <a>Settings Sidebar</a> of each selected block in the Block Editor. While there are a few minor exceptions, see the FAQs below, this means that visibility control will be enabled for all core WordPress blocks as well as any third-party blocks provided by a plugin, or that came with your theme.',
							'block-visibility'
						),
						{
							a: <a href="https://wordpress.org/support/article/wordpress-editor/#the-anatomy-of-a-block" target="_blank" />,
						}
					) }
				</p>
				<p>
					{ __( 
						'On the Visibility panel, you will be able show or hide the selected block based on a number of different controls. The primary option is to simply hide the block from view. This can be useful if you want to disable some content, but you still need to publish other changes to the page or post. You can also restrict who can see certain blocks. For example, maybe you have a special promotion that you only want show subscribers of your website. With this plugin, it couldn’t be easier. If you haven’t already, watch the video above for a quick demo.',
						'block-visibility'
					) }
				</p>
				<p>
					{ __( 
						'Block Visibility was designed to be simple to use, but it comes with a number of advanced settings so you can configure the plugin exactly the way you want. Lets examine these in the drop-downs below and answer a few frequently asked questions.',
						'block-visibility'
					) }
				</p>
			</div>
			<div className="bv-getting-started__panels">
                <PanelBody
                    title={ __( 'Visibility Controls', 'block-visibility' ) }
					initialOpen={ false }
                >
						<p>
							{ __( 
								'Visibility controls form the engine that powers this plugin. These are the settings that determine whether a block is hidden on the frontend of your website. We strive to provide as much visibility control as possible, and as development for Block Visibility continues, expect even more functionality in the future. However, we understand that some users do not need every option. It is equally important to have a decluttered and streamlined user interface. Therefore, on the Visibility Controls tab of this settings page, you can enable or disable any control!',
								'block-visibility'
							) }
						</p>
						<p>
							{ __( 
								'Please note that when a control is disabled, blocks that relied on the disabled control will likely become visible again. For example, the “Hide Block” control globally hides blocks for all users. A block with this setting enabled would become visible again if you disable the “Hide Block” control. Likely this is what you intended, but we wanted to provide this warning just in case.',
								'block-visibility'
							) }
						</p>
                </PanelBody>
				<PanelBody
                    title={ __( 'Block Manager', 'block-visibility' ) }
					initialOpen={ false }
                >
                    <PanelRow>
						<p>
							{ __( 
								'Please note that when a control is disabled, blocks that relied on the disabled control will likely become visible again. For example, the “Hide Block” control globally hides blocks for all users. A block with this setting enabled would become visible again if you disable the “Hide Block” control. Likely this is what you intended, but we wanted to provide this warning just in case.',
								'block-visibility'
							) }
						</p>
                    </PanelRow>
                </PanelBody>
				<PanelBody
					title={ __( 'Settings', 'block-visibility' ) }
					initialOpen={ false }
				>
					<PanelRow>
					<p>
						{ __( 
							'Please note that when a control is disabled, blocks that relied on the disabled control will likely become visible again. For example, the “Hide Block” control globally hides blocks for all users. A block with this setting enabled would become visible again if you disable the “Hide Block” control. Likely this is what you intended, but we wanted to provide this warning just in case.',
							'block-visibility'
						) }
					</p>
					</PanelRow>
				</PanelBody>
				<PanelBody
					title={ __( 'Frequently Asked Questions', 'block-visibility' ) }
					initialOpen={ false }
				>
					<PanelRow>
						Getting Started...
					</PanelRow>
				</PanelBody>
            </div>
			<div className="bv-getting-started__help">
				<h2>{ __( 'Need more help? Have a question?', 'block-visibility' ) }</h2>
				<p>
					{ __( 
						'Whether you need more help, have a quick question, or you have a feature request, please create a topic in this plugin\'s support forum on WordPress.org.', 
						'block-visibility' 
					) }
				</p>
				<Button 
					href={ blockVisibilityVariables.supportUrl }
					isPrimary
				>
				 	{ __( 'Get Support', 'block-visibility' ) }
				</Button>
			</div>
		</div>
    );
}
