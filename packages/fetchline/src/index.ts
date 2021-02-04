import http from 'http'
import https from 'https'

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

const getChunkIteratorFetch = async (
  filepath: string
): Promise<ReadableStreamDefaultReader<Uint8Array>> => {
  const res = await fetch(filepath)
  if (res.body === null) {
    throw new Error('Cannot read file')
  }
  return res.body.getReader()
}

const isNode =
  typeof fetch !== 'function' &&
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  typeof global !== 'undefined' &&
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  {}.toString.call(global) === '[object global]'

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
    delimiter = /\r\n|\n|\r/g,
  }: {
    includeLastEmptyLine?: boolean
    encoding?: string
    delimiter?: string | RegExp
  } = {}
): AsyncIterableIterator<string> {
  let reader
  let nextMethodName

  if (isNode) {
    reader = await (getChunkIteratorNode as (
      filepath: string
    ) => Promise<AsyncIterableIterator<Uint8Array>>)(filepath)
    nextMethodName = 'next'
  } else {
    reader = await getChunkIteratorFetch(filepath)
    nextMethodName = 'read'
  }

  let { value: chunk, done: readerDone } = await (reader as typeof reader &
    Record<typeof nextMethodName, () => { value: Uint8Array; done: boolean }>)[
    nextMethodName
  ]()
  const textDec = new TextDecoder(encoding)
  let chunkStr = chunk ? textDec.decode(chunk) : ''

  const re: RegExp =
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
      ;({ value: chunk, done: readerDone } = await (reader as typeof reader &
        Record<
          typeof nextMethodName,
          () => { value: Uint8Array; done: boolean }
        >)[nextMethodName]())
      chunkStr = remainder + (chunkStr ? textDec.decode(chunk) : '')
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
