/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	ExternalLink,
	PanelBody,
	PanelRow,
} from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Renders the Getting Started tab of the Block Visibility settings page
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function GettingStarted( props ) {
	const { pluginVariables } = props.variables;

	return (
		<div className="setting-tabs__getting-started inner-container narrow">
			<div className="setting-tabs__tab-description">
				<div className="tab-description__header">
					<h2>{ __( 'Welcome', 'block-visibility' ) }</h2>
				</div>
				<p>
					{ __(
						"Thank you for choosing Block Visibility. As the name suggests, this plugin allows you to easily control the visibility of blocks in the WordPress editor. To get started, watch the video below for an overview of how the plugin works. You'll become a pro in no time!",
						'block-visibility'
					) }
				</p>
			</div>
			<div className="getting-started__video">
				<iframe
					title={ __(
						'Block Visibility - Getting Started',
						'block-visibility'
					) }
					width="1123"
					height="632"
					src="https://www.youtube-nocookie.com/embed/DdDwQCE7RNE?modestbranding=1&controls=1&rel=0"
					frameBorder="0"
					allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				></iframe>
			</div>
			<div className="getting-started__details">
				<h2>{ __( 'How does it work?', 'block-visibility' ) }</h2>
				<p>
					{ createInterpolateElement(
						__(
							'The Block Visibility plugin is designed exclusively for the <a>block editor</a> and does not work in the classic editor. So long as you are running the latest version of WordPress and are not utilizing the Classic Editor plugin, you are good to go!',
							'block-visibility'
						),
						{
							a: (
								<ExternalLink // eslint-disable-line
									href="https://wordpress.org/support/article/wordpress-editor/"
									target="_blank"
									rel="noreferrer"
								/>
							),
						}
					) }
				</p>
				<p>
					{ createInterpolateElement(
						__(
							'By default, this plugin adds a Visibility panel to the <a>settings sidebar</a> of each selected block in the WordPress editor. While there are a few minor exceptions, see the FAQs below, this means that visibility controls will be enabled for all core WordPress blocks as well as any third-party blocks that you might be using.',
							'block-visibility'
						),
						{
							a: (
								<ExternalLink // eslint-disable-line
									href="https://wordpress.org/support/article/wordpress-editor/#the-anatomy-of-a-block"
									target="_blank"
									rel="noreferrer"
								/>
							),
						}
					) }
				</p>
				<p>
					{ __(
						'On the Visibility panel, you will be able show or hide the selected block based on a number of different controls. The primary option is to simply hide the block from view. This can be useful if you want to disable some content, but you still need to publish other changes to the page or post. You can also restrict who can see certain blocks. For example, maybe you have a special promotion that you only want show subscribers of your website. If you haven’t already, watch the video above for a quick demo.',
						'block-visibility'
					) }
				</p>
				<p>
					{ __(
						'Block Visibility provides a number of advanced settings so you can configure the plugin exactly the way you want. Lets examine these in the drop-downs below and answer a few frequently asked questions.',
						'block-visibility'
					) }
				</p>
			</div>
			<div className="getting-started__panels">
				<PanelBody
					title={ __( 'Visibility Controls', 'block-visibility' ) }
					initialOpen={ false }
				>
					<PanelRow>
						<p>
							{ __(
								'Visibility controls are the settings that determine whether a block is hidden on the frontend of your website. We strive to provide as much visibility control as possible, and as development for Block Visibility continues, expect even more functionality in the future. However, we understand that some users do not need every option. It is equally important to have a decluttered and streamlined user interface. Therefore, on the Visibility Controls tab of this settings page, you can enable or disable any control.',
								'block-visibility'
							) }
						</p>
					</PanelRow>
				</PanelBody>
				<PanelBody
					title={ __( 'Block Manager', 'block-visibility' ) }
					initialOpen={ false }
				>
					<PanelRow>
						<p>
							{ __(
								'By default, this plugin adds visibility controls to all blocks in the WordPress editor. Similar to visibility controls, we understand that not all users may want this functionality. You might decide to restrict visibility controls to only a handful of block types. On the Block Manager tab of this settings page, you can do just that. Simply disable the block types that should not have visibility controls and the settings will no longer be available in the WordPress editor.',
								'block-visibility'
							) }
						</p>
					</PanelRow>
				</PanelBody>
				<PanelBody
					title={ __( 'General Settings', 'block-visibility' ) }
					initialOpen={ false }
				>
					<PanelRow>
						<p>
							{ __(
								'The General Settings tab contains a collection of miscellaneous plugin options including Full Control Mode and uninstall settings. As development of Block Visibility continues, expect more settings to be developed.',
								'block-visibility'
							) }
						</p>
					</PanelRow>
				</PanelBody>
				<PanelBody
					title={ __(
						'Frequently Asked Questions',
						'block-visibility'
					) }
					initialOpen={ false }
				>
					<PanelRow>
						<div className="panels__content-label">
							{ __(
								'Does this plugin really work for every block?',
								'block-visibility'
							) }
						</div>
						<p>
							{ __(
								'Yes! However, not all block types are enabled by default. Visibility controls are only provided to blocks that can be added directly to a page/post by the block inserter. Therefore, some specialized blocks, such as child blocks, are not included by default. An example being the individual Column block that is part of the larger Columns block.',
								'block-visibility'
							) }
						</p>
						<p>
							{ __(
								'That said, you can enable Full Control Mode in the plugin settings. This removes all restrictions and adds visibility controls to every block. You probably will not need Full Control Mode, but it is there if you do.',
								'block-visibility'
							) }
						</p>
						<p>
							{ createInterpolateElement(
								__(
									'Furthermore, while this plugin was designed to be compatible with all blocks, the WordPress ecosystem is ever expanding. If you find a conflict with a certain block, please let us know in the <a>plugin support forum</a> and we will investigate. We are committed to bringing visibility control to every block.',
									'block-visibility'
								),
								{
									a: (
										<ExternalLink // eslint-disable-line
											href={ pluginVariables.supportUrl }
											target="_blank"
											rel="noreferrer"
										/>
									),
								}
							) }
						</p>
						<div className="panels__content-label">
							{ __(
								'Will more visibility controls be added in the future?',
								'block-visibility'
							) }
						</div>
						<p>
							{ createInterpolateElement(
								__(
									'Yes, and if you have a specific idea of what you would like to see, please submit a feature request in the <a>plugin support forum</a> on WordPress.org.',
									'block-visibility'
								),
								{
									a: (
										<ExternalLink // eslint-disable-line
											href={ pluginVariables.supportUrl }
											target="_blank"
											rel="noreferrer"
										/>
									),
								}
							) }
						</p>
						<div className="panels__content-label">
							{ __(
								'Does this plugin work with the upcoming full site editing functionality?',
								'block-visibility'
							) }
						</div>
						<p>
							{ createInterpolateElement(
								__(
									'As of version 1.4.0, Block Visibility is supported in the Site Editor, which is provided by Full Site Editing. Note that you will currently need the Gutenberg plugin and a Full Site Editing theme to make use of this functionality. Full Site Editing is still very much in development and you may find bugs or compatibility issues when using this plugin in the Site Editor. If you do, please let us know in the <a>plugin support forum</a> on WordPress.org. We are committed to ensuring 100 percent compatibility by the time Full Site Editing is included in WordPress core.',
									'block-visibility'
								),
								{
									a: (
										<ExternalLink // eslint-disable-line
											href={ pluginVariables.supportUrl }
											target="_blank"
											rel="noreferrer"
										/>
									),
								}
							) }
						</p>
						<div className="panels__content-label">
							{ __(
								'Is there a pro/premium version of Block Visibility?',
								'block-visibility'
							) }
						</div>
						<p>
							{ createInterpolateElement(
								__(
									'A premium version of Block Visibility is in the works and will include some specialized controls, such as time-based restrictions. For current information on Block Visibility Premium, please visit <a>blockvisibilitywp.com</a>.',
									'block-visibility'
								),
								{
									a: (
										<ExternalLink // eslint-disable-line
											href="https://www.blockvisibilitywp.com/"
											target="_blank"
											rel="noreferrer"
										/>
									),
								}
							) }
						</p>
					</PanelRow>
				</PanelBody>
			</div>
			<div className="getting-started__help">
				<h2>{ __( 'How can we help?', 'block-visibility' ) }</h2>
				<p>
					{ __(
						"Whether you need more help, have a quick question, or you would like to request a new feature, please create a topic in this plugin's support forum on WordPress.org.",
						'block-visibility'
					) }
				</p>
				<Button
					href={ pluginVariables.supportUrl }
					target="__blank"
					isPrimary
				>
					{ __( 'Get Support', 'block-visibility' ) }
				</Button>
			</div>
		</div>
	);
}
