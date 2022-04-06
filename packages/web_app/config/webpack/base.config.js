const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackInlineSVGPlugin = require("html-webpack-inline-svg-plugin");

const prod = process.env.NODE_ENV === 'production';

module.exports = {
        mode: prod ? 'production' : 'development',
        module: {
            rules: [{
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    resolve: {
                        extensions: ['.ts', '.tsx', '.js', '.json'],
                    },
                    use: 'ts-loader',
                }, {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                }, {
                    test: /\.(png|jp(e*)g|svg|gif)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'images/[hash]-[name].[ext]',
                            },
                        },
                    ],
                }]
        },
        devtool: prod ? undefined : 'source-map',
        plugins: [
            new HtmlWebpackPlugin({
                template: 'index.html',
            }),
            new MiniCssExtractPlugin(),
            new HtmlWebpackInlineSVGPlugin({
                runPreEmit: true,
            }),
        ]
};