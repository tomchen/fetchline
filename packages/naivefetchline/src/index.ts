const escapeRegExp = (s: string): string =>
  s.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')

/**
 * Fetch and read remote text file line by line over HTTP(S) with modern browsers or Deno (naive approach)
 *
 * @param filepath - URL of the text file
 * @param options - options, including the following three
 * @param options.includeLastEmptyLine - Should it count the last empty line?
 * @param options.encoding - File encoding
 * @param options.delimiter - Line (or other item)'s delimiter / separator
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
  try {
    const response = await fetch(filepath)
    const buffer = await response.arrayBuffer()
    const decoder = new TextDecoder(encoding)
    const text = decoder.decode(buffer)
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
    const rows = text.split(re)
    if (includeLastEmptyLine === false && rows[rows.length - 1] === '') {
      rows.pop()
    }
    for (const row of rows) {
      yield row
    }
  } catch (error) {
    throw error
  }
}
