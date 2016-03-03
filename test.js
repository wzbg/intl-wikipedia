/* 
* @Author: zyc
* @Date:   2016-02-18 14:39:14
* @Last Modified by:   zyc
* @Last Modified time: 2016-03-03 11:57:18
*/
'use strict'

const Intlpedia = require('./index')

// const searchTerm = 'Bernie Sanders'
// const searchTerm = 'Ron Paul'
// const searchTerm = 'Netflix'
// const searchTerm = '伯尼·桑德'
// const searchTerm = 'Barcelona'
// const searchTerm = 'Smartphone'
// const searchTerm = 'eastern Syria'
// const searchTerm = 'National Book Award'
// const searchTerm = 'space-to-ground communications'
const searchTerm = 'S&P'

const intlpedia = new Intlpedia('zh')
intlpedia.search(searchTerm).then(page => {
  console.log(page)
  // console.log(JSON.stringify(page))
  // console.log(page.infobox)
  // for (let infobox of page.infobox) {
  //   console.log(infobox)
  // }
  // for (let image of page.images) {
  //   intlpedia.getFullImage(image).then(image => console.log(image))
  // }
  // intlpedia.getFullImage(page.images).then(images => console.log(images))
}).catch(err => console.error(err))