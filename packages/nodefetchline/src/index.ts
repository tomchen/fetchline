import http from 'http'
import https from 'https'
import fs from 'fs'
import path from 'path'

const getChunkIteratorNode = async (
  filepath: string
): Promise<AsyncIterableIterator<Uint8Array>> => {
  let h: typeof http | typeof https
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

const escapeRegExp = (s: string): string =>
  s.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')

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
export default async function* (
  filepath: string,
  {
    includeLastEmptyLine = true,
    encoding = 'utf-8',
    delimiter = /\r?\n/g,
  }: {
    includeLastEmptyLine?: boolean
    encoding?: string
    delimiter?: string | RegExp
  } = {}
): AsyncIterableIterator<string> {
  const reader = await getChunkIteratorNode(filepath)

  let { value: chunk, done: readerDone } = await reader.next()
  const decoder = new TextDecoder(encoding)
  let chunkStr = chunk ? decoder.decode(chunk) : ''

  let re: RegExp
  if (typeof delimiter === 'string') {
    if (delimiter === '') {
      throw new Error('delimiter cannot be empty string!')
    }
    re = new RegExp(escapeRegExp(delimiter), 'g')
  } else if (/g/.test(delimiter.flags) === false) {
    re = new RegExp(delimiter.source, delimiter.flags + 'g')
  } else {
    re = delimiter
  }

  let startIndex = 0

  while (1) {
    const result = re.exec(chunkStr)
    if (result === null) {
      if (readerDone === true) {
        break
      }
      const remainder = chunkStr.substring(startIndex)
      ;({ value: chunk, done: readerDone } = await reader.next())
      chunkStr = remainder + (chunkStr ? decoder.decode(chunk) : '')
      startIndex = 0
      continue
    }
    yield chunkStr.substring(startIndex, result.index)
    startIndex = re.lastIndex
  }

  if (includeLastEmptyLine || startIndex < chunkStr.length) {
    yield chunkStr.substring(startIndex)
  }
}
