'use strict';

console.info('require page 500.')

require('commonCss')
require('../sass/common.scss')
require('../sass/page_500.scss')

// 这里不能引用jquery,否则会打包进来，直接用jquery对象就好了
require('jquery')

// 直接使用npm模块
// const _ = require('lodash')

/*require.ensure(['./loading2'], function(require) {
    require('./loading2')
		console.log(obj.loading,'change')
})*/
/*loadJS('./loading2',function(a){
	console.log(a)
})
function loadJS(file, cb){
	require.ensure([], function(require) {
	    cb(require(file))
	})
}*/