/* 
* @Author: zyc
* @Date:   2016-02-18 19:42:54
* @Last Modified by:   zyc
* @Last Modified time: 2016-02-26 12:03:54
*/
'use strict'

const fetchUrl = require('fetch').fetchUrl
const wikipedia = require('wtf_wikipedia')
const cheerio = require('cheerio')
const URL = require('url')

module.exports = (searchTerm, language) => (
  new Promise((resolve, reject) => {
    intlpedia(searchTerm, language).then(page => {
      if (!page.images) return resolve(page)
      Promise.all(page.images.map(name => new Promise(resolve => {
        const image = { name }
        const base = `https://${language}.wikipedia.org`
        fetchUrl(`${base}/wiki/${name}`, (err, res, buf) => {
          if (!err && res.status === 200) {
            const $ = cheerio.load(buf)
            image.url = URL.resolve(base, $('div.fullImageLink a').attr('href'))
          }
          resolve(image)
        })
      }))).then(images => {
        page.images = images
        resolve(page)
      })
    }).catch(err => reject(err))
  })
)

const intlpedia = (searchTerm, language) => (
  new Promise((resolve, reject) => {
    wikipedia.from_api(encodeURI(searchTerm), language, markup => {
      if (markup) {
        const page = wikipedia.parse(markup)
        if (page.type === 'redirect') return intlpedia(page.redirect, language).then(page => resolve(page)).catch(err => reject(err))
        page.name = searchTerm
        page.language = language
        return resolve(page)
      }
      const url = `https://${language}.wikipedia.org/w/api.php?action=query&list=search&utf8&format=json&srsearch=${encodeURI(searchTerm)}`
      fetchUrl(url, (err, res, buf) => {
        if (err) return reject(err)
        if (res.status !== 200) return reject(new Error(`error status: ${res.status}`))
        const results = JSON.parse(buf).query.search
        if (!results.length) return reject(new Error(`not found: ${searchTerm}`))
        getPage(results.map(result => result.title), language).then(page => resolve(page)).catch(err => reject(err))
      })
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