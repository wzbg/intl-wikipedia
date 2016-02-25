/* 
* @Author: zyc
* @Date:   2016-02-18 14:39:14
* @Last Modified by:   zyc
* @Last Modified time: 2016-02-25 17:44:36
*/
'use strict'

const intlpedia = require('./index')

// const searchTerm = 'Bernie Sanders'
// const searchTerm = 'Ron Paul'
// const searchTerm = 'Netflix'
const searchTerm = '伯尼·桑德'

intlpedia(searchTerm, 'zh')
  .then(page => console.log(page))
  .catch(err => console.error(err))