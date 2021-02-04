/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-extra-semi
;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory)
  } else if (typeof module === 'object' && module.exports) {
    // Node
    module.exports = factory()
  } else {
    // Browsers
    root.fetchline = factory()
  }
})(typeof self !== 'undefined' ? self : this, function () {
  const getChunkIteratorNode = async (filepath) => {
    const http = require('http')
    const https = require('https')
    let h
    const protocol = new URL(filepath).protocol
    if (protocol === 'http:') {
      h = http
    } else if (protocol === 'https:') {
      h = https
    } else {
      throw new Error(
        'Invalid protocol. The URL must start with "http://" or "https://"'
      )
    }

    return await new Promise((resolve, reject) => {
      h.get(filepath, (res) => {
        if (res.statusCode !== undefined && res.statusCode >= 400) {
          reject(new Error(`HTTP Status: ${res.statusCode}`))
        }
        resolve(res[Symbol.asyncIterator]())
      })
    })
  }

  const escapeRegExp = (s) => s.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')

  const getChunkIteratorFetch = async (filepath) => {
    const res = await fetch(filepath)
    if (res.body === null) {
      throw new Error('Cannot read file')
    }
    return res.body.getReader()
  }

  /**
   * Fetch and read text file line by line
   *
   * With native `fetch()` method. To be used for modern browsers or Deno to fetch remote file over HTTP(S)
   *
   * @param filepath - URL of the text file
   * @param includeLastEmptyLine - Should it count the last empty line?
   *
   * @returns An asynchronous iterable iterator containing each line in string from the text file
   */
  return async function* (
    filepath,
    {
      includeLastEmptyLine = true,
      encoding = 'utf-8',
      delimiter = /\r\n|\n|\r/g,
    } = {}
  ) {
    const reader = await (typeof fetch === 'function'
      ? getChunkIteratorFetch
      : getChunkIteratorNode)(filepath)
    const iterFuncName = typeof fetch === 'function' ? 'read' : 'next'

    let { value: chunk, done: readerDone } = await reader[iterFuncName]()
    const decoder = new TextDecoder(encoding)
    let chunkStr = chunk ? decoder.decode(chunk) : ''

    const re =
      typeof delimiter === 'string'
        ? new RegExp(escapeRegExp(delimiter), 'g')
        : delimiter

    let startIndex = 0

    while (1) {
      const result = re.exec(chunkStr)
      if (!result) {
        if (readerDone) {
          break
        }
        const remainder = chunkStr.substring(startIndex)
        ;({ value: chunk, done: readerDone } = await reader[iterFuncName]())
        chunkStr = remainder + (chunkStr ? decoder.decode(chunk) : '')
        startIndex = re.lastIndex = 0
        continue
      }
      yield chunkStr.substring(startIndex, result.index)
      startIndex = re.lastIndex
    }

    if (includeLastEmptyLine || startIndex < chunkStr.length) {
      yield chunkStr.substring(startIndex)
    }
  }
})
