/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    entry: path.join(__dirname, 'src', 'index.tsx'),
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'index.bundle.js',
        clean: true,
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'src'),
        },
        proxy: {
            '/reg_service/api/v1': {
                target: 'http://localhost:5000',
                pathRewrite: { '^/reg_service/api/v1': '' },
                changeOrigin: true,
            }
        },
        historyApiFallback: true,
        port: 3000
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html'),
        }),
        new ESLintPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(js|ts)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env'],
                            ['@babel/preset-react', {
                                runtime: 'automatic'
                            }],
                            ['@babel/preset-typescript'],
                        ]
                    }
                }
            },
            {
                test: /\.ts|tsx$/,
                exclude: /node_modules/,
                use: ['ts-loader']
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1
                        }
                    },
                    'sass-loader'
                ],
                include: /\.module\.scss$/
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ],
                exclude: /\.module\.scss$/
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/img/[hash][ext]'
                }
            },
            {
                test: /\.(|ttf|woff|woff2)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/fonts/[hash][ext]'
                },
            },
        ]
    }
}