/* 
* @Author: zyc
* @Date:   2016-02-18 14:39:14
* @Last Modified by:   zyc
* @Last Modified time: 2016-03-14 15:31:10
*/
'use strict'

const Intlpedia = require('./index')

// const searchTerm = 'Bernie Sanders'
// const searchTerm = 'Ron Paul'
// const searchTerm = 'Netflix'
// const searchTerm = 'Barcelona'
// const searchTerm = 'Smartphone'
// const searchTerm = 'eastern Syria'
// const searchTerm = 'National Book Award'
// const searchTerm = 'space-to-ground communications'
// const searchTerm = 'S&P'
// const searchTerm = 'analyst'
// const searchTerm = 'Leah Kaufmann'
// const searchTerm = 'List of positions filled by presidential appointment with Senate confirmation'
// const searchTerm = 'Instagram'
// const searchTerm = 'National Sleep Foundation'
// const searchTerm = 'maroon'
// const searchTerm = 'The Crown'
// const searchTerm = 'IRS Free File'

// const searchTerm = '联邦调查局'
// const searchTerm = '伯尼·桑德'
// const searchTerm = '菲律宾'
const searchTerm = '马恩维'

// const intlpedia = new Intlpedia('en')
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

// Intlpedia.getData('Q8333').then(data => console.log(data.wikipedia)).catch(err => console.error(err))