/*
 * @author: colpu
 * @date: 2016-10-14 14:16:41
 * @last modified by: colpu
 * @last modified time: 2016-10-14 14:16:41
 */
'use strict';
const path = require('path')
  , fs = require('fs')
  , glob = require('glob')
  , _ = require('lodash')

  // webpack相关使用模块定义
  , webpack = require('webpack')
  , HtmlWebpackPlugin = require('html-webpack-plugin') // Html打包插件
  , CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin // 公共块提取插件

// 配置目录
const dir = {
  root: '/',
  src: path.resolve(process.cwd(), 'src'),
  dist: path.resolve(process.cwd(), 'dist'),
  js: 'static/js/',
  style: 'static/styles/',
  images: 'static/images/',
  libs: 'static/js/libs/',
  html: 'views/',
  nodeModPath: path.resolve(__dirname, '../node_modules')
}

let entries = getEntry(path.resolve(dir.src, 'views'), 'html,htm') // 入口js文件列表(js模块名字)
  , chunks = Object.keys(entries) // 获取对象的键值(模块名字)
  // 自动生成入口文件，入口js名必须和入口文件名相同
  // 例如，a页的入口文件是a.html，那么在js目录下必须有一个a.js作为入口文件
  , plugins = entryHtml(path.resolve(dir.src, 'views'), entries)

let config = {
  dir: dir,
  debug: true,
  cache: false,
  // 入口文件
  entry: _.merge(entries, {
    'common': ['jquery','zepto'],
  }),

  // 输出目录
  output: {
    path: dir.dist, // 输出目录
    publicPath: dir.root, //???这里publicPath要使用绝对路径，不然scss/css最终生成的css图片引用路径是错误的
    
    filename: dir.js + '[name].js', //默认输出以原始文件名相同
    chunkFilename: dir.js + 'chunk.[hash:8].js', // 按需加载模块命名方式
    hotUpdateChunkFilename: dir.js + '[id].js',
  },

  // 决定性配置
  resolve: {
    root: [dir.src, dir.nodeModPath],
    //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
    extensions: ['', '.js', '.css', '.scss', '.tpl', '.png', '.jpg'],
    //配置别名，在项目中可缩减引用路径
    alias: {
      zepto: dir.libs + 'zepto',
      jquery: dir.libs + 'jquery',
      commonCss: dir.style + 'common.css',
      webpackLogo: dir.images + 'webpack.png'
    }
  },

  // 模块
  module: {
    // loader操作
    loaders: [
      /*{
        test: /\.scss/,
        loader: 'style-loader!css-loader!postcss-loader!autoprefixer-loader?{browsers:["last 2 version","Firefox 15"]}!sass-loader?outputStyle=expanded'
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader!autoprefixer-loader?{browsers:["last 2 version","Firefox 15"]}'
      },{
        test: /\.less/,
        loader: 'style-loader!css-loader!postcss-loader!less-loader'
      },*/
      {
        test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
        loaders: [
          // url-loader更好用，小于10KB的图片会自动转成dataUrl，
          // 否则则调用file-loader，参数直接传入
          'url?limit=10000&name=static/images/[hash:8].[name].[ext]',
          'image?{bypassOnDebug:true, progressive:true,optimizationLevel:3,pngquant:{quality:"65-80",speed:4}}'
        ]
      },{
        test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
        loader: 'url?limit=10000&name=fonts/[hash:8].[name].[ext]'
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.(mp4|ogg|svg)$/,
        loader: 'file-loader'
      /*}, {
        test: /\.html$/,
        loader:'html?minimize=false'*/
      }
    ],
  },

  // 插件运用
  plugins: [
    // 提取公共块
    new CommonsChunkPlugin({
      name:['common','vender'],
    }),
    // 使用bower安装的插件
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
    )
  ].concat(plugins)
}

module.exports = config

/**
 * [getEntry 获取多页面的每个入口文件，用于配置中的entry]
 * 这里通过对html文件的获取来对应js文件，
 * @Author   colpu
 * @DateTime 2016-10-14T16:47:03+0800
 * @param    {[string]}                 path [路径]
 * @param    {[string]}                 type [后缀可以为多个分别用,隔开]
 * @param    {[string]}                 replaceType [后缀可以为多个分别用,隔开]
 * @return   {[object]}                 [json对象]
 */
function getEntry(path, type) {
  path = path.replace(/\\/g, '/') + '/' // 解决windows系统路径为\杠的问题
  let jsPath = path.replace('views/', dir.js)
  
  let entryFile = glob.sync(path + '**/*.'+ (type.split(',').length > 1?'{'+ type +'}':type)),
    reg = new RegExp('(.*)\.(' + type.replace(/,/g, '|') + ')'),
    obj = {}

  entryFile.forEach((file)=>{   
    let pathName = file.replace(path, '') //删除第一个/后的字符串
    let name = pathName.match(reg)[1] // 获得对应的名字，这里可以带路径/这样就能生成对应的目录
    obj[name] = jsPath + name + '.js'
  })
  
  return obj
}

/**
 * [entryHtml html入口文件]
 * @Author   colpu
 * @DateTime 2016-10-14T20:50:08+0800
 * @param    {[string]}                 path    [路径]
 * @param    {[array]}                 entries [js入口文件]
 * @return   {[array]}                         [description]
 */
function entryHtml(path, entries){
  path = path.replace(/\\/g, '/') + '/' // 解决windows系统路径为\杠的问题
  let entryFile = glob.sync(path + '**/*.html'),
    reg = new RegExp('(.*)\.(html)'),
    tmpArr = []

  entryFile.forEach((file) => {    
    let pathName = file.replace(path, ''), //删除第一个/后的字符串
        name = pathName.match(reg)[1]
    let conf = {
      filename: dir.html + name + '.html',
      template: 'html!' + file,
      /*minify: {//压缩HTML文件
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: false //删除空白符与换行符
      }*/
    }

    if (name in entries) {
      conf.inject = 'body'
      conf.chunks = ['vender','common', name ]
    }
    tmpArr.push(new HtmlWebpackPlugin(conf))
  })
  
  return tmpArr
}