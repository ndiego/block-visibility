=== Block Visibility ===
Author URI: https://www.nickdiego.com
Contributors: ndiego, outermostdesign
Tags: visibility, scheduling, hide, schedule, blocks, schedule blocks, hide blocks, block editor
Requires at least: 5.5
Tested up to: 5.6
Requires PHP: 5.6
Stable tag: 1.4.2
License: GPL-2.0
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Provides visibility controls and scheduling functionality to all WordPress blocks.

== Description ==

Block Visibility allows you to dynamically control which blocks are visible on your website and who can see them, which includes the ability to schedule blocks.

Built for the new Block (Gutenberg) Editor, this plugin was designed to work with **any** WordPress block. This includes blocks natively provided by WordPress as well as third-party blocks.

=== Visibility Controls ===

Visibility controls determine whether a block should be visible to users on the frontend of your website. Current controls include:

* **Hide** blocks from all users
* **Schedule** block visibility using a start and end date/time
* Only show blocks to **logged-in** users
* Only show blocks to **logged-out** users
* Only show blocks to users with **specific roles** (Administrator, Subscriber, Customer, Member etc.)

=== Why do I need this? ===

Block Visibility is a lightweight plugin that is designed to do one thing, and one thing well. While there are countless applications, here are a few examples to get you started:

* Use as a content management tool. Hide new blocks while you are working on them but still keep the page published.
* Temporarily hide seasonal content on your website rather than having to delete it.
* Schedule promotional content and/or event information to display at a set time.
* Restrict content so it's only visible to your customers or members.
* Display messaging to logged-out users encouraging them to subscribe to your blog.
* Conditionally display elements in the upcoming Full Site Editor.

For an **unbiased review**, the plugin was featured on [WordPress Tavern](https://wptavern.com/show-and-hide-content-via-the-block-visibility-wordpress-plugin).

=== Powerful Settings ===

Tailor Block Visibility to your needs, or those of your clients, with powerful plugin settings.

* Disable any visibility control
* Restrict visibility controls to specific block types
* Set permissions so only certain users have access to visibility controls
* Disable contextual indicators and other plugin utilities
* Enable Full Control Mode
* Remove all plugin settings on uninstall

=== Plays nice with others  ===

Block Visibility is designed to work with **any** block and has been tested with these top block libraries and plugins.

* WooCommerce
* Jetpack
* CoBlocks
* Redux Framework
* Ultimate Addons for Gutenberg
* Kadence Blocks
* Otter Blocks
* Atomic Blocks
* Gutentor
* Stackable
* Getwid
* EditorsKit
* Genesis Blocks

Find an issue? Let us know in the plugin support forum and we will investigate ASAP. Excellent compatibility with the greater WordPress block ecosystem is our top priority.

=== See It In Action ===

While a bit out of date, the video below provides a good overview of what Block Visibility can do and covers everything in version 1.0. Updated video coming soon!

https://www.youtube.com/watch?v=DdDwQCE7RNE

== Screenshots ==

1. Quickly and easily hide any block on your website.
2. Schedule any block using start and end date/time settings.
3. Control who can see each block with user role restrictions.
4. Designed to work with all blocks, including WooCommerce as seen here.
5. An overview of the plugin settings.
6. General plugin settings to enable/disable certain functionality including user permissions and Full Control Mode.
7. Choose which visibility controls you would like to use on your site.
8. Disable or enable visibility on certain block types with the Block Manager.
9. The Getting Started page provides useful information to help you get up and running with Block Visibility.

== Installation ==

1. You have a couple options:
	* Go to Plugins &rarr; Add New and search for "Block Visibility". Once found, click "Install".
	* Download Block Visibility from Wordpress.org and make sure the folder us zipped. Then upload via Plugins &rarr; Add New &rarr; Upload.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. From the 'Plugins' page, head directly to the plugin 'Settings' page.
4. Once there, you can click on the 'Getting Started' tab where you will be presented with some getting started information along with the plugin [demo video](https://www.youtube.com/watch?v=DdDwQCE7RNE).

== Frequently Asked Questions ==

= Does this plugin really work with any block? (i.e. What is Full Control Mode?) =
Yes! However, not all block types are enabled by default. Visibility controls are only provided to blocks that can be added directly to a page/post by the block inserter. Therefore, some specialized blocks, such as child blocks, are not included by default. An example being the individual Column block that is part of the larger Columns block.

That said, you can enable Full Control Mode in the plugin settings. This removes all restrictions and adds visibility controls to every block. You probably will not need Full Control Mode in most cases, but it is there if you do!

Furthermore, while this plugin was designed to be compatible with all blocks, the WordPress ecosystem is ever expanding. If you find a conflict with a certain block, please let us know in the plugin support forum and we will investigate. We are committed to bringing visibility control to **every** block.

= Can Block Visibility be used with any WordPress theme? =
Yup, this plugin is not theme specific. You just need to be running the latest version of WordPress (5.4+) and be using the Block Editor. This plugin provides zero functionality to the Classic Editor.

= Will more visibility controls be added in the future? =
Yes, and if you have a specific idea of what you would like to see, please submit a feature request in the plugin support forum on WordPress.org.

= Does this plugin work with the upcoming full site editing functionality? =
As of version 1.4.0, Block Visibility is supported in the Site Editor, which is provided by Full Site Editing. Note that you will currently need the Gutenberg plugin and a Full Site Editing theme to make use of this functionality. Full Site Editing is still very much in development and you may find bugs or compatibility issues when using this plugin in the Site Editor. If you do, please let us know in the plugin support forum. We are committed to ensuring 100% compatibility by the time Full Site Editing is included in WordPress core.

= Does Block Visibility work with Elementor? =
No. Block Visibility was design specifically for the WordPress Block (Gutenberg) Editor, and therefore does no work on pages that are controlled by the Elementor editor.

= Is block visibility controlled using CSS? =
Nope. Visibility is controlled on the server, so if a block should be hidden based on the set controls, it will not even be rendered. This ensures the plugin does not load any additional resources on the frontend of your site, thereby optimizing performance. Additional features in the future may necessitate the use of CSS, but this functionality will be optional.


== Changelog ==

= 1.4.2 - 2021-01-19 =

**Fixed**

* Error that occurred when the plugin was deleted.
* Contextual indicator border not displaying on placeholder blocks (e.g. the Shortcode Block)

= 1.4.1 - 2021-01-18 =

**Added**

* The ability to disabled scheduling at the block level without having to remove the start and end date/times.
* The `blockVisibility` "supports" variable to all blocks types that have visibility enabled. This provide a more consistent method for detecting whether a block should have visibility controls or not.

**Changed**

* The contextual indicator icons have been updated and are now more legible.
* Refactored the scheduling controls.
* Updated the Visibility by Role labels to be more consistent with standard WordPress labeling and nomenclature.

**Deprecated**

* The `startDateTime` and `endDateTime` properties of the `blockVisibility` attribute have been deprecated. All new blocks will use the new `scheduling` property.

**Removed**

* Visibility block attribute defaults in an effort to declutter block markup when only a few settings are enabled.

**Fixed**

* Some third-party blocks were not receiving visibility controls when they should have, notably Jetpack blocks, due to the way their block JS is enqueued.

= 1.4.0 - 2021-01-01 =

**Upgrade Warning**

For the long-term maintainability of the Block Visibility plugin, changes to the underlying file structure were needed in version 1.4.0. Therefore, when you upgrade from version 1.3.0 or lower, the plugin will deactivate and you will receive an error message. But don't worry, simply re-activate Block Visibility and you are good to go.

This is an unfortunate issue that will occur only once. We apologize for any inconvenience that this causes, but trust that this change better positions the plugin for many exciting enhancements in the future!

**Added**

* Preliminary compatibility with Full Site Editing (Requires the Gutenberg plugin and a theme that is Full Site Editing compatible)
* Hooks and slots to support the upcoming Pro add-on

**Changed**

* Block Visibility now requires WordPress 5.5+ to take advantage of new core functionality
* The base plugin file is now simply `block-visibility.php` and the setup class has been moved
* Redesigned the Block Visibility settings page
* Refactored the methods for fetching plugin setting and variable data on the Block Visibility settings page

**Removed**

* Component styling that is not longer needed since the version requirement for the plugin is now WordPress 5.5+

= 1.3.0 - 2020-12-05 =
**Added**

* User permissions now give website administrators control over who can use visibility settings
* Custom REST API routes for retrieving plugin data

**Changed**

* By default, visibility controls are now available to all users that have access to the Block Editor
* Refactored the methods for fetching plugin setting and variable data in the Block Editor
* Restructured much of the plugin with a more consistent file/folder layout

**Fixed**

* Contextual indicator icon was incorrect when using all visibility controls and the block was disabled

= 1.2.0 - 2020-11-15 =
**Added**

* Added the ability to "hide on selected roles" in the Restrict by User Roles visibility control (Thanks to @edwardsh for the feature request!)

= 1.1.0 - 2020-11-05 =
**Added**

* Date and time controls for block scheduling
* Contextual indicators for visibility setting to the Block Editor
* A toolbar option for quickly hiding blocks
* Additional plugin settings to dynamically control all the new features

= 1.0.1 - 2020-08-11 =
**Fixed**

* Addressed the PHP warning message that may appear on new installations

= 1.0.0 - 2020-08-03 =
* Initial Release

== Upgrade Notice ==

= 1.4.0 =

Version 1.4.0 includes a necessary file structure change that will deactivate the plugin when upgrading and throw an error message. But don't worry, simply re-activate Block Visibility and you are good to go. We apologize for this inconvenience and it will not happen again.
