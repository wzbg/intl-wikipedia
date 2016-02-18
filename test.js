/* 
* @Author: zyc
* @Date:   2016-02-18 14:39:14
* @Last Modified by:   zyc
* @Last Modified time: 2016-02-19 01:01:11
*/
'use strict'

const intlpedia = require('./index')
 
intlpedia('Bernie Sanders', 'Chinese')
  .then(res => console.log(res))
  .catch(err => console.error(err))