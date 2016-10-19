'use strict'
const path = require('path')
// 允许环境列表
const allowedEnvs = ['dev', 'pro']
/**
 * [导出webpack配置]
 * @Author   colpu
 * @DateTime 2016-10-19T13:18:50+0800
 * @param    {string}                wantedEnv [希望运行的环境]
 * @return   {[Object]}                        [webpack的配置]
 */
module.exports = function(wantedEnv){
  let isValid = wantedEnv && wantedEnv.length > 0 && allowedEnvs.indexOf(wantedEnv) !== -1;
  let validEnv = isValid ? wantedEnv : 'dev';
  let config = require(path.join(__dirname, 'config/webpack.' + validEnv));
  return config;
}