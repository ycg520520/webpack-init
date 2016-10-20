'use strict';
let gulp = require('gulp')
  , $ = require('gulp-load-plugins')() //自动加载gulp开头的插件
  , webpack = require('webpack')
  , WebpackDevServer = require('webpack-dev-server')
  , webpackConfig = require('./webpack.config.js')
  , jshintStylish = require('jshint-stylish') // 语法检测报告美化

// 全局配置
let config = {
  // 路径配置
  src: 'src/',
  js: ['!src/static/js/libs/**/*.{js,coffee,jsx}', 'src/static/js/**/*.{js,coffee,jsx}'], // js文件
  dist: 'dist/'
}

// js 语法监测check
gulp.task('jshint', () => {
  return gulp.src(config.js)
    .pipe($.jshint())
	  .pipe($.jshint.reporter(jshintStylish))
})

// 清理操作
gulp.task('clean', () => {
  return gulp.src(config.dist)
    .pipe($.clean())
    .pipe($.notify({ message: 'dist目录删除完毕!' }));
});

// webpack 配置打包操作
gulp.task('webpack', ['clean','jshint'], (done) => {
  webpack(webpackConfig('pro'), (err, stats) => {
    if(err) throw new $.util.PluginError('webpack', err)
    $.util.log('[webpack]', stats.toString({colors: true}))
    done()
  })
})

// webpack 开发服务器
gulp.task('webpackDevServer', ['jshint'], (callback) => {
  let config = webpackConfig()
  // 开启webpack-dev-server
  new WebpackDevServer(webpack(webpackConfig()),config.devServer)
  .listen(config.devServer.port, 'localhost', function(err) {
    if (err) throw new $.util.PluginError('webpack开发服务', err);
    $.util.log('webpack开发服务', 'http://localhost:'+config.devServer.port+'/webpack-dev-server/index.html')
  })
})

// 默认打包操作操作
gulp.task('default', ['webpackDevServer'])
gulp.task('build', ['webpack'])

// 部署文件到远程服务器
gulp.task('deploy', () => {
  return gulp.src(config.dist + '**')
    .pipe($.sftp({
      host: '[remote server ip]', // 远程服务器ip
      remotePath: '/www/app/', // 远程服务器目录
      user: 'user', // 远程服务器用户名
      pass: 'pass' // 远程服务器密码
    }))
})