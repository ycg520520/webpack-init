/*
* @author: colpu
* @date: 2016-10-14 14:16:41
* @last modified by: colpu
* @last modified time: 2016-10-14 14:16:41
*/
'use strict'

const _ = require('lodash')

// webpack相关使用模块定义
const webpack = require('webpack')
  , ExtractTextPlugin = require('extract-text-webpack-plugin') // 独立打包插件
  , HtmlWebpackPlugin = require('html-webpack-plugin') // Html打包插件
  , UglifyJsPlugin = webpack.optimize.UglifyJsPlugin // JS压缩插件
  , CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin // 公共块提取插件
  , DefinePlugin = webpack.DefinePlugin // 定制压缩插件
  , defaultSettings = require('./webpack.default') // 默认的webpack配置
  , dir = defaultSettings.dir // 获得默认配置中的目录配置

// 提取样式对象
let extractCSS = new ExtractTextPlugin(dir.style + '[name].css?[contenthash]')

// 利用lodash整合默认配置
let config = _.merge(defaultSettings, {
  cache: true,
  devtool: 'source-map',
  output: {
    filename: dir.js + '[name].[hash:8].js', //默认输出以原始文件名相同
    chunkFilename: dir.js + 'chunk.[chunkhash:8].js', // 按需加载模块命名方式
    hotUpdateChunkFilename: dir.js + '[id].[hash:8].js',
  },

  // 开发服务器配置
  devServer: {
    contentBase: './src/',
    historyApiFallback: true,
    hot: true,
    port: 3000,
    noInfo: false,
    inline: true,
    stats: {
      cached: false,
      colors: true
    }
  }
});

// 为实现webpack-hot-middleware做相关配置
// @see https://github.com/glenjamin/webpack-hot-middleware
(function(entry) {
  for (let key of Object.keys(entry)) {
    if (!Array.isArray(entry[key])) {
      entry[key] = Array.of(entry[key])
    }
    entry[key].push('webpack-hot-middleware/client?reload=true')
  }
})(config.entry)


// 添加需要的loaders到默认的loader中
config.module.loaders.push({
  test: /\.css$/,
  loader: extractCSS.extract('style', ['css'])
}, {
  test: /\.scss$/,
  loader: extractCSS.extract('style', ['css?sourceMap', 'sass'])
})

// 添加需要的plugins到默认的plugins中
config.plugins.push(
  extractCSS,
  // use `production` mode
  new DefinePlugin({ 'process.env': { 'NODE_ENV': JSON.stringify('production') } }),
  /*new AssetsPlugin({
      filename: path.resolve(assets, 'source-map.json')
  }),*/
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
)

module.exports = config;