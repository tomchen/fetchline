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
    delimiter = /\r\n|\n|\r/g,
  }: {
    includeLastEmptyLine?: boolean
    encoding?: string
    delimiter?: string | RegExp
  } = {}
): AsyncIterableIterator<string> {
  const res = await fetch(filepath)
  if (res.body === null) {
    throw new Error('Cannot read file')
  }

  const reader = res.body.getReader()
  let { value: chunk, done: readerDone } = await reader.read()
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
      ;({ value: chunk, done: readerDone } = await reader.read())
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
