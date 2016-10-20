'use strict';

console.info('require page 404.')

require('commonCss')
require('../sass/common.scss')
require('../sass/page_404.scss')

// 这里不能引用jquery,否则会打包进来，直接用jquery对象就好了
require('jquery')

// 直接使用npm模块
// const _ = require('lodash')
console.log('404')