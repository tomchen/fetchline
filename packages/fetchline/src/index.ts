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
  const reader = await getChunkIteratorFetch(filepath)

  let { value: chunk, done: readerDone } = await reader.read()
  const decoder = new TextDecoder(encoding)
  let chunkStr = chunk ? decoder.decode(chunk) : ''

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
      ;({ value: chunk, done: readerDone } = await reader.read())
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
