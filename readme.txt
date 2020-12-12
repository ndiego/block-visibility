=== Block Visibility ===
Author URI: https://www.nickdiego.com
Contributors: ndiego, outermostdesign
Tags: visibility, scheduling, hide, schedule, blocks, schedule blocks, hide blocks, block editor
Requires at least: 5.5
Tested up to: 5.6
Requires PHP: 5.6
Stable tag: 1.4.0
License: GPL-2.0
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Block Visibility provides visibility controls and scheduling functionality to all WordPress blocks.

== Description ==

Block Visibility allows you to dynamically control which blocks are visible on your website and who can see them, which includes the ability to schedule blocks. Built for the new Block Editor, this plugin was designed to work with any WordPress block. This includes blocks natively provided by WordPress as well as third-party blocks, such as those by WooCommerce, Gutenberg Blocks, Genesis (Atomic) Blocks, CoBlocks and more...

= See It In Action =

The video below provides a good overview of what Block Visibility can do and covers everything in version 1.0. [See what's new in version 1.1](https://www.blockvisibilitywp.com/whats-new-in-version-1-1/).

https://www.youtube.com/watch?v=DdDwQCE7RNE

= Visibility Controls =

Visibility controls are the settings that determine whether a block is hidden on the frontend of your website. Current controls include the ability to:

* Show or hide any block
* Schedule any block using a start and end date/time (New)
* Configure visibility based on whether a user is logged-in or logged-out
* Configure visibility based on the role of a user (Administrator, Editor, Subscriber, etc.)

= Powerful Settings =
While Block Visibility is designed to work with any block, we understand that not **every** block needs visibility control. Based on the needs of your website or client, you may want to restrict this functionality to only a few select blocks.

Advanced plugin settings allow you to choose which block types have visibility enabled. You can also decide which visibility controls you would like to use. Simply turn off the ones you don’t need for a more streamlined interface.

== Screenshots ==

1. Quickly and easily hide any block on your website.
2. Schedule any block using start and end date/time settings.
3. Control who can see each block with user role restrictions.
4. Designed to work with all blocks, including WooCommerce as seen here.
5. The Getting Started page of the plugin settings.
6. Choose which visibility controls you would like to use on your site.
7. Disable or enable visibility on certain block types with the Block Manager.
8. Additional plugin settings to enable/disable certain functionality including Full Control Mode.

== Installation ==

1. You have a couple options:
	* Go to Plugins &rarr; Add New and search for "Block Visibility". Once found, click "Install".
	* Download Block Visibility from Wordpress.org and make sure the folder us zipped. Then upload via Plugins &rarr; Add New &rarr; Upload.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. From the 'Plugins' page, head directly to the plugin 'Settings' page.
4. There you will be presented with some getting started information along with the plugin [demo video](https://www.youtube.com/watch?v=DdDwQCE7RNE).

== Frequently Asked Questions ==

= Does this plugin really work with any block? =
Yes! However, not all block types are enabled by default. Visibility controls are only provided to blocks that can be added directly to a page/post by the block inserter. Therefore, some specialized blocks, such as child blocks, are not included by default. An example being the individual Column block that is part of the larger Columns block.

That said, you can enable Full Control Mode in the plugin settings. This removes all restrictions and adds visibility controls to every block. You probably will not need Full Control Mode, but it is there if you do.

Furthermore, while this plugin was designed to be compatible with all blocks, the WordPress ecosystem is ever expanding. If you find a conflict with a certain block, please let us know in the plugin support forum and we will investigate. We are committed to bringing visibility control to **every** block.

= Can Block Visibility be used with any WordPress theme? =
Yup, this plugin is not theme specific. You just need to be running the latest version of WordPress (5.4+) and be using the Block Editor. This plugin provides zero functionality to the Classic Editor.

= Will more visibility controls be added in the future? =
Yes, and if you have a specific idea of what you would like to see, please submit a feature request in the plugin support forum on WordPress.org.

= Does this plugin work with the upcoming full site editing functionality? =
Since full site editing is still in the development phase, this plugin does not currently work with this new functionality. However, Block Visibility was designed with full site editing in mind. There are tons of interesting applications for visibility control and we plan to get the plugin ready for full site implementation in the coming months.

== Changelog ==

= 1.3.0 - 2020-XX-XX =
**Changed**

* Block Visibility now requires WordPress 5.5+ to take advantage of new core functionality

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
