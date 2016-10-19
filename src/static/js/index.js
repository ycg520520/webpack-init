'use strict';

console.info('require page index.');

require('commonCss')
require('../sass/index.scss')

// require('jquery')

var body = document.getElementsByTagName('body')[0]
$('body').click(function(){
	require.ensure([], function(require) {
			var a = require('./loading2')
			console.log(a.loading())
	})
})

var logoImg = require('webpackLogo');
var $logo = $('<img />').attr('src', logoImg);
$('#logo').html($logo);