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
 * Fetch and read remote text file line by line over HTTP(S) with modern browsers or Deno
 *
 * @param filepath - URL of the text file
 * @param options - options, including the following three
 * @param options.includeLastEmptyLine - Should it count the last empty line?
 * @param options.encoding - File encoding
 * @param options.delimiter - Line (or other item)'s delimiter / separator
 *
 * @returns An asynchronous iterable iterator containing each line in string from the text file
 */
export default async function* fetchline(
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
  const reader = await getChunkIteratorFetch(filepath)

  let { value: chunk, done: readerDone } = await reader.read()
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
      ;({ value: chunk, done: readerDone } = await reader.read())
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export = fetchline
