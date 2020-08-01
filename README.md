# Block Visibility

[![License](https://img.shields.io/badge/license-GPL--2.0%2B-red.svg)](https://github.com/ndiego/block-visibility/blob/master/LICENSE.txt)

Control the visibility of any block in WordPress.

**Full readme coming soon...**

Getting Started

Block Visibility, as the name would suggest, was designed to control the visibility of any block available in WordPress. This includes blocks natively provided by WordPress, as well as third-party blocks, such as those from WooCommerce and CoBlocks.

Does this plugin really add visibility control to **any** block?

Yes, and no. The block ecosystem is expanding rapidly, especially with the concept of full-site editing on the horizon. Currently we are restricting visibility controls to only blocks that can be added by the block inserter in the WordPress editor. We are also excluding *child blocks*.

An example of a *child block* is a single column in the core WordPress Columns block. While it makes sense to control visibility for the entire Columns block, or, for example, an Image block inside of a column, hiding an individual column with visibility controls does not have an obvious use case and would break the layout of your site.

So, while the plugin can technically add controls to **any** block, some limitations have been purposefully added to improve the user experience. These limitations may be removed in the future if a sound use case emerges.

Visibility Controls

There are number of ways you can control the visibility of a block. While there is a time and place for each control, you may not need all of them. Use the settings below to choose which visibility controls you want to use on this website. If a visibility control is disabled, any blocks that were previously using these controls may become visible.  

Hide Block

This control allows a block to be hidden on the frontend of your website. The block will still be viewable and editable in the WordPress editor, but no one will be able to see it outside of the editor. If enabled, the **Hide Block** control overrides all other visibility controls.



## Installation

1. Make sure you are running the latest version of WordPress (5.4+) and you are using the Block Editor
2. Download Block Visibility from the [WordPress plugin directory](https://wordpress.org/plugins/block-visibility/).

## Development

1. Setup a local WordPress environment.
2. In the `wp-content/plugins` folder, clone the GitHub repository: `https://github.com/ndiego/block-visibility.git`
3. Navigate to the `wp-content/plugins/block-visibility` folder in the command line.
4. Run the `npm install` command to install the plugin's dependencies within a `/node_modules/` folder.
5. Run the `npm run start` command to compile and watch source files for changes while developing.
