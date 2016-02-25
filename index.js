/* 
* @Author: zyc
* @Date:   2016-02-18 19:42:54
* @Last Modified by:   zyc
* @Last Modified time: 2016-02-25 15:10:57
*/
'use strict'

const fetchUrl = require('fetch').fetchUrl
const wikipedia = require('wtf_wikipedia')

module.exports = (searchTerm, language) => (
  new Promise((resolve, reject) => {
    const url = `https://${language}.wikipedia.org/w/api.php?action=query&list=search&utf8&format=json&srsearch=${encodeURI(searchTerm)}`
    fetchUrl(url, (err, res, buf) => {
      if (err) return reject(err)
      if (res.status !== 200) return reject(new Error(`error status: ${res.status}`))
      const results = JSON.parse(buf).query.search
      if (!results.length) return resolve()
      getPage(results.map(result => result.title), language).then(page => resolve(page)).catch(err => reject(err))
    })
  })
)

const getPage = (searchTerms, language, index) => (
  new Promise((resolve, reject) => {
    index = index || 0
    if (searchTerms.length === index) return reject(new Error('no result'))
    wikipedia.from_api(encodeURI(searchTerms[index]), language, markup => {
      if (!markup) return getPage(searchTerms, language, ++index)
      const page = wikipedia.parse(markup)
      page.name = searchTerms[index]
      page.language = language
      resolve(page)
    })
  })
)