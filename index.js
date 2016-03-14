/* 
* @Author: zyc
* @Date:   2016-02-18 19:42:54
* @Last Modified by:   zyc
* @Last Modified time: 2016-03-14 15:27:41
*/
'use strict'

const fetchUrl = require('fetch').fetchUrl
const request = require('sync-request')
const cheerio = require('cheerio')
const URL = require('url')

module.exports = class {
  constructor (language) {
    this.language = language
    this.base = `https://${language}.wikipedia.org/`
  }

  search (searchTerm) {
    return new Promise((resolve, reject) => (
      this.getPage(searchTerm).then(page => resolve(page)).catch(err => {
        fetchUrl(`${this.base}w/api.php?action=query&list=search&utf8&format=json&srsearch=${encodeURIComponent(searchTerm)}`, (err, res, buf) => {
          if (err) return reject(err)
          if (res.status !== 200) return reject(new Error(`error status: ${res.status}`))
          const query = JSON.parse(buf).query
          if (!query) return reject(new Error(`no result: ${searchTerm}`))
          const results = query.search
          if (!results.length) return reject(new Error(`not found: ${searchTerm}`))
          this.getPage(results.map(result => result.title)).then(page => resolve(page)).catch(err => reject(err))
        })
      })
    ))
  }

  getPage (searchTerms, index) {
    index = index || 0
    if (!(searchTerms instanceof Array)) searchTerms = [searchTerms]
    if (!searchTerms[index]) return Promise.reject(new Error('no result'))
    const res = request('GET', `${this.base}wiki/${encodeURIComponent(searchTerms[index])}`)
    if (res.statusCode !== 200) return this.getPage(searchTerms, ++index)
    const $ = cheerio.load(res.body)
    $('script,sup.reference,div.mediaContainer,table.metadata,span.mw-editsection,a.edit-page').remove() // 删除无用信息
    const page = {
      language: this.language, // 语言
      finalUrl: decodeURIComponent(res.url), // 最终网址
      name: $('h1#firstHeading').text(), // 名称
      contents: [] // 内容
    }
    const infobox = [] // 表格
    $('table.infobox').find('tr').each((index, element) => {
      const tr = []
      $(element).children().each((index, element) => {
        const td = { name: element.name }
        const imgs = []
        $(element).find('img').each((index, element) => imgs.push(URL.resolve(this.base, $(element).attr('src'))))
        if (imgs.length) td.imgs = imgs
        const text = $(element).text().trim()
        if (text) td.text = text
        if (imgs.length || text) tr.push(td)
      })
      if (tr.length) infobox.push(tr)
    })
    page.infobox = infobox
    $('table.infobox').remove()
    const images = [] // 相册
    $('a.image').each((index, element) => {
      const node = $(element)
      const name = node.attr('href')
      const title = node.attr('title')
      const image = { url: URL.resolve(this.base, node.find('img').attr('src')) }
      if (title) image.title = title
      if (name) image.name = name
      images.push(image)
    })
    page.images = images
    const summaries = [] // 概要
    const map = new Map() // 内容
    let title
    $('div#mw-content-text').children('h2,h3,h4,div,p,ul,ol,table').each((index, element) => {
      const node = $(element)
      const text = node.text().trim()
      const name = element.name
      if (name === 'h2') title = text
      if (title) {
        if (name === 'h2') {
          map.set(title, [])
        } else {
          const para = { name }
          if (text) {
            if (name === 'table') {
              para.table = []
              const caption = node.find('caption').text()
              if (caption) para.caption = caption
              node.find('tr').each((index, element) => {
                const tr = []
                para.table.push(tr)
                $(element).children().each((index, element) => {
                  tr.push({
                    name: element.name,
                    text: $(element).text().trim()
                  })
                })
              })
            } else if (name === 'ul') {
              para[name] = []
              node.find('li').each((index, element) => {
                const node = $(element)
                const li = { text: node.text().trim() }
                const url = node.find('img').attr('src')
                if (url) li.img = URL.resolve(this.base, url)
                para[name].push(li)
              })
            } else {
              para.text = text
            }
            map.get(title).push(para)
          }
        }
      } else if (text) {
        summaries.push(text)
      }
    })
    page.summary = summaries.join('\n')
    for (let entity of map) {
      page.contents.push({ title: entity[0], content: entity[1] })
    }
    $('div#mw-normal-catlinks ul li a').each((index, element) => {
      page.tags = page.tags || [] // 分类
      page.tags.push($(element).text())
    })
    return Promise.resolve(page)
  }

  getFullImage (images) {
    if (images instanceof Array) return Promise.all(images.map(image => this.getFullImage(image)))
    return new Promise(resolve => (
      fetchUrl(URL.resolve(this.base, images.name), (err, res, buf) => {
        if (!err && res.status === 200) {
          const $ = cheerio.load(buf)
          const url = $('div.fullImageLink a').attr('href')
          if (url) images.fullImage = URL.resolve(this.base, url)
        }
        resolve(images)
      })
    ))
  }

  static getData (dataId) {
    return new Promise((resolve, reject) => (
      fetchUrl('https://www.wikidata.org/wiki/' + dataId, (err, res, buf) => {
        if (err) return reject(err)
        if (res.status !== 200) return reject(new Error(`error status: ${res.status}`))
        const data = {}
        const $ = cheerio.load(buf)
        const group = 'data-wb-sitelinks-group'
        $(`div[${group}]`).each((index, element) => {
          const node = $(element)
          const key = node.attr(group)
          const items = []
          node.find('li a').each((index, element) => {
            const node = $(element)
            items.push({
              name: node.text(),
              language: node.attr('hreflang'),
              url: decodeURIComponent(node.attr('href'))
            })
          })
          if (items.length) data[key] = items
        })
        resolve(data)
      })
    ))
  }
}