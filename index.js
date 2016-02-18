/* 
* @Author: zyc
* @Date:   2016-02-18 19:42:54
* @Last Modified by:   zyc
* @Last Modified time: 2016-02-19 01:47:09
*/
'use strict'

const fetchUrl = require('fetch').fetchUrl
const easypedia = require('easypedia')

module.exports = (searchTerm, language) => {
  return new Promise((resolve, reject) => {
    easypedia(searchTerm, { language }, (error, page) => {
      if (error) return reject(error)
      const text = page._text || {}
      if (Object.keys(text).length) return resolve(page)
      const url = `https://${page.language}.wikipedia.org/w/api.php?action=query&list=search&utf8&format=json&srsearch=${encodeURI(searchTerm)}`
      fetchUrl(url, (err, res, buf) => {
        if (err || res.status != 200) return resolve(page)
        const results = JSON.parse(buf).query.search
        if (!results.length) return resolve(page)
        easypedias(results.map(result => result.title), language).then(page => resolve(page)).catch(err => resolve(page))
      })
    })
  })
}

const easypedias = (searchTerms, language, index) => {
  index = index || 0
  return new Promise((resolve, reject) => {
    if (searchTerms.length === index) return reject(new Error(`error index: ${index}`))
    easypedia(encodeURI(searchTerms[index]), { language }, (error, page) => {
      if (error) return easypedias(searchTerms, language, ++index)
      resolve(page)
    })
  })
}