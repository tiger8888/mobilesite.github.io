'use strict';
var webpack = require('webpack');
var path = require('path');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common','js/common.js');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanPlugin = require('clean-webpack-plugin');
var HtmlPlugin = require('html-webpack-plugin');
var CopyPlugin = require('copy-webpack-plugin');

var cssExtractTextPlugin = new ExtractTextPlugin("css/[name].css", {allChunks: true});
var lessExtractTextPlugin = new ExtractTextPlugin("css/[name].css", {allChunks: true});

var srcPath = path.join(__dirname, '/src/');
var pagesPath = path.join(__dirname,'/src/pages/');
var nodeModulesPath = path.join(__dirname, '/node_modules/');
var includePath = srcPath;

var buildPath = path.join(__dirname, '/build/');
var buildPublicPath = 'http://localhost:63342/webpackdemo/build/';
var buildDevServerHost = 'localhost';
var buildDevServerPort = '8080';

module.exports = {
    devtool: 'eval-source-map',
    entry: {
        'vendor': [
            nodeModulesPath + 'zepto/dist/zepto.min.js',
            nodeModulesPath + 'react/dist/react.min.js',
            nodeModulesPath + 'react-dom/dist/react-dom.min.js',
            nodeModulesPath + 'vue/dist/vue.min.js'
        ],
        'test-normal': pagesPath + 'test-normal/test-normal.js',
        'test-es6': pagesPath + 'test-es6/test-es6.js',
        'test-react': pagesPath + 'test-react/test-react.js',
        'test-less': pagesPath + 'test-less/test-less.js',
        'test-autoprefixer': pagesPath + 'test-autoprefixer/test-autoprefixer.js',
        'test-vue': pagesPath + 'test-vue/test-vue.js'
    },
    output: {
        path: buildPath,
        filename: 'js/[name].js',
        publicPath: buildPublicPath           //publicPath影响着单独作为css文件输出的css中对于图片的引用路径
    },
    module: {
        loaders: [
            {
                test:/\.js$/,
                loader: 'babel-loader',//这里写babel或babel-loader都是可以的
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.css$/,
                loader: cssExtractTextPlugin.extract('style', 'css!postcss'),
                //loader: "style!css!postcss",
                include: includePath
            },
            {
                test: /\.less$/,
                loader: lessExtractTextPlugin.extract('style', 'css!postcss!less?sourceMap'),
                //loader:'style!css!postcss!less',
                include: includePath
            },
            {
                test: /\.(png|jpg|svg)$/,
                loader: 'url?limit=20&name=/images/[name].[ext]?[hash]',
                // query: {
                //     name: 'images/[name].[ext]?[hash]',
                //     limit: 20
                // },
                include: includePath
            },
            {
                test: '/\.(woff|woff2|ttf|eot)$',
                loader: 'url',
                query: {
                    limit: 20480
                },
                include: includePath
            },
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.(html|htm)/,
                loader: 'html'
            }
        ]
    },
    postcss: function () {
        return {
            defaults: [autoprefixer],
            cleaner:  [autoprefixer({ browsers: [] })]
        };
    },
    plugins: [
        new CleanPlugin(['build']),
        cssExtractTextPlugin,
        lessExtractTextPlugin,
        commonsPlugin,
        new HtmlPlugin({
            filename: 'test-normal.html',
            template: pagesPath + 'test-normal/test-normal.html',
            inject: true
        }),
        new HtmlPlugin({
            filename: 'test-es6.html',
            template: pagesPath + 'test-es6/test-es6.html',
            inject: true
        }),
        new HtmlPlugin({
            filename: 'test-react.html',
            template: pagesPath + 'test-react/test-react.html',
            inject: true
        }),
        new HtmlPlugin({
            filename: 'test-vue.html',
            template: pagesPath + 'test-vue/test-vue.html',
            inject: true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"dev"'
            },
            $: "zepto",
            Zepto: "zepto",
            "window.Zepto": "zepto"
        }),
        new CopyPlugin([{
            from: srcPath + 'index.html',
            to: buildPath + 'index.html'
        }])
    ],
    resolve: {
        alias: {
            'pages': pagesPath,
            'components': path.join('../../../src/components'),
            'react': nodeModulesPath + 'react/dist/react.min.js',
            'react-dom':  nodeModulesPath + 'react-dom/dist/react-dom.min.js',
            'vue': nodeModulesPath + 'vue/dist/vue.min.js'
        },
        extensions: ['', '.js', '.coffee', '.json', '.css', '.vue', '.less',  '.png', '.jpg']
    },
    options: {
        buildPublicPath: 'http://localhost:63342/webpackdemo/build/',
        buildDevServerHost: 'localhost',
        buildDevServerPort: '8080'
    }
}