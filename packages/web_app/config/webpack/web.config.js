const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./base.config');

const outputPath = path.join(__dirname, "..", "..", '/dist/web');

module.exports = merge(baseConfig, {
    entry: path.join(__dirname, "..", "..", '/src/index.web.tsx'),
    output: {
        path: outputPath
    },
    devServer: {
        static: {
            directory: outputPath,
        },
        compress: true,
        port: 9000,
    }
});