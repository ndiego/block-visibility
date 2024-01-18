# Block Visibility

[![License](https://img.shields.io/badge/license-GPL--2.0%2B-green.svg)](https://github.com/ndiego/block-visibility/blob/master/LICENSE.txt) ![WordPress Plugin Active Installs](https://img.shields.io/wordpress/plugin/installs/block-visibility?color=%23007cba&label=Active%20Installs&logo=wordpress&style=flat-square)

<img width="1544" alt="banner-1544x500" src="https://github.com/ndiego/block-visibility/blob/main/.wordpress-org/banner-1544x500.png?raw=true">

[Block Visibility](https://wordpress.org/plugins/block-visibility/) allows you to dynamically control which blocks are visible on your WordPress website and who can see them, which includes the ability to schedule blocks.

Block Visibility is built exclusively for the WordPress Editor (Gutenberg) and is designed to work with **any** WordPress block. This includes blocks natively provided by WordPress, third-party blocks, and even block-based widgets.

Watch the [Plugin Overview](https://www.youtube.com/watch?v=CW1L4vBpXjw) demo video to get started with Block Visibility. You can also [test the plugin in your browser](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/ndiego/block-visibility/main/.playground/blueprint.json) using Playground.

## Integrations

Block Visibility also includes direct integrations for the following third-party services.

* [WooCommerce](https://blockvisibilitywp.com/knowledge-base/how-to-use-the-woocommerce-control/?bv_query=readme&utm_source=block_visibility&utm_medium=github&utm_campaign=readme)
* [Advanced Custom Fields](https://blockvisibilitywp.com/knowledge-base/how-to-use-the-advanced-custom-fields-control/?bv_query=readme&utm_source=block_visibility&utm_medium=github&utm_campaign=readme)
* [Easy Digital Downloads](https://blockvisibilitywp.com/knowledge-base/how-to-use-the-how-to-use-the-easy-digital-downloads-control/-control/?bv_query=readme&utm_source=block_visibility&utm_medium=github&utm_campaign=readme)
* [WP Fusion](https://blockvisibilitywp.com/knowledge-base/how-to-use-the-wp-fusion-control/?bv_query=readme&utm_source=block_visibility&utm_medium=github&utm_campaign=readme)

## Connect
- [Learn more at Blockvisibilitywp.com](https://www.blockvisibilitywp.com/)
- [Download on WordPress.org](https://wordpress.org/plugins/block-visibility/)
- [Follow on Twitter](https://twitter.com/BlockVisibility)

## Installation

1. Make sure you are running the latest version of WordPress, and you are using the Block Editor
2. Download Block Visibility from the [WordPress plugin directory](https://wordpress.org/plugins/block-visibility/).

## Development

1. Set up a local WordPress environment.
2. In the `wp-content/plugins` folder, clone the GitHub repository: `https://github.com/ndiego/block-visibility.git`
3. Navigate to the `wp-content/plugins/block-visibility` folder in the command line.
4. Run the `npm install` command to install the plugin's dependencies within a `/node_modules/` folder.
5. Run the `composer install` command to install the additional WordPress composer tools within a `/vendor/` folder.
5. Run the `npm run start` command to compile and watch source files for changes while developing.
