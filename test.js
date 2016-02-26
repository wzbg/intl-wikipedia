/* 
* @Author: zyc
* @Date:   2016-02-18 14:39:14
* @Last Modified by:   zyc
* @Last Modified time: 2016-02-26 15:41:04
*/
'use strict'

const intlpedia = require('./index')

// const searchTerm = 'Bernie Sanders'
// const searchTerm = 'Ron Paul'
// const searchTerm = 'Netflix'
// const searchTerm = '伯尼·桑德'
// const searchTerm = 'Barcelona'
const searchTerm = 'Smartphone'
// const searchTerm = 'National Book Award'
// const searchTerm = 'space-to-ground communications'

intlpedia(searchTerm, 'zh')
  .then(page => console.log(page))
  .catch(err => console.error(err))