const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

const RemoveEmptyScriptsPlugin = require( 'webpack-remove-empty-scripts' );

module.exports = {
    ...defaultConfig,

    entry: {
        'block-visibility-editor' : path.resolve( process.cwd(), 'src/editor.js' ),
        'block-visibility-settings' : path.resolve( process.cwd(), 'src/settings.js' ),
        'block-visibility-editor-styles': path.resolve( process.cwd(), 'src/styles/editor.scss' ),
        'block-visibility-contextual-indicator-styles': path.resolve( process.cwd(), 'src/styles/contextual-indicators.scss' ),
        'block-visibility-setting-styles' : path.resolve( process.cwd(), 'src/styles/settings.scss' ),
    },

    output: {
        filename: '[name].js',
        path: path.resolve( process.cwd(), 'build/' ),
    },

    module: {
        ...defaultConfig.module,
        rules: [
            ...defaultConfig.module.rules,
            // Add additional rules as needed.
        ]
    },

    plugins: [
        ...defaultConfig.plugins,
        // Add additional plugins as needed.
        new RemoveEmptyScriptsPlugin(),
    ],
};
