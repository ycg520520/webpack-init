# webpack-init

基于webpack搭建纯静态页面型前端工程解决方案模板。

### 安装软件
- Node.js   #v4.0+

### 拷贝项目模板
``` bash
$ git clone https://github.com/ycg520520/webpack-init.git
```


### 安装依赖模块
``` bash
$ npm install -g gulp webpack
$ cd webpack-init && npm install
```

### 本地开发环境

- 启动本地开发服务器
    ``` bash
    $ npm run start
    ```

### 业务开发

##### 目录结构
``` js

┌─ src/  # 源码目录
│  ├─ views/  # 存放主题模版文件目录；
│  │  ├─ login/  # 登录文件目录
│  │  │  └─ index.js  # 登录入口文件index
│  │  ├─ index.html  # 入口文件index；
│  │  ├─ 404.html  # 入口文件400；
│  │  ├─ 500.html  # 入口文件500；
│  │  └─ error.html  # 入口文件error；
│  ├─ static/  # 静态资源目录；
│  │  ├─ sass/  # sass原始文件目录；
│  │  ├─ less/  # less原始文件目录；
│  │  ├─ styles/  # css原始文件目录；
│  │  ├─ images/  # 图片文件目录；
│  │  ├─ js/  # js文件目录；
│  │  │  ├─ libs/  # 第三方库目录 `如jQuery、React等通过bower安装`；
│  │  │  ├─ components/  # 组件目录 ；
│  │  │  ├─ login/  # 登录文件目录
│  │  │  │  └─ index.js  # 登录入口文件index
│  │  │  ├─ index.js  # index页面入口；
│  │  │  ├─ 400.js  # 400页面入口；
│  │  │  ├─ 500.js  # 500页面入口；
│  │  │  └─ error.js  # error页面入口；
│  │  └─ favicon.ico  # 网站图标文件；
│  └─ pathmap.json  # 手动配置某些模块的路径，可以加快webpack的编译速度；
├─ upload/  # 上传资源目录，`可更具需求设置到其它位置`；
├─ config/  # 配置文件目录；
│  ├─ webpack.default.js  # webpack默认配置
│  ├─ webpack.dev.js  # 开发环境webpack配置入口
│  └─ webpack.pro.js  # 正式环境webpack配置入口
├─ dist/  # 打包文件目录；
├─ test/  # 测试文件目录；
├─ .babelrc  # 统一编码配置文件，`针对babel编译`；
├─ .bowerrc  # 自定义bower下载的代码包目录；
├─ .editorconfig  # 统一编码配置文件，`针对支持editorconfig编辑器`；
├─ .gitignore  # 这是git忽略配置文件，`推送到git时忽略的文件配置列表`；
├─ .jshintrc  # js语法校验配置文件；
├─ .npmignore  # npm包发布忽略配置文件；
├─ gulpfile.js  # gulp自动化构建工具配置启动文件；
├─ LICENSE.txt  # 软件许可证文件；
├─ bower.json  # bower安装配置文件包下载管理；
├─ package.json  # 开发运行依赖包配置文件；
├─ webpack.config.js  # webpack配置
└─ README.md  # 项目阅读说明文件；
```

##### 单/多页面支持

约定`/src/views/**/*.html`为应用的入口文件，在`/src/js/`一级目录下有一个同名的js文件作为该入口文件的逻辑入口（即entry）。
在编译时会扫描入口html文件并且根据webpack配置项解决entry的路径依赖，同时还会对html文件进行压缩、字符替换等处理。
这样可以做到同时支持SPA和多页面型的项目

### build编译
``` bash
$ npm run build
```

### deploy部署&发布
把`dist`文件夹部署到指定机器即可（先配置好机器ip、密码、上传路径等信息）：

``` js
$ npm run deploy # or run `gulp deploy`
```

如果需要将生成的js、css、图片等发布到cdn，修改下`publicPath`项为目标cdn地址即可：

``` js
output: {
  publicPath: env ? 'http://cdn.site.com' : null 
}
```
