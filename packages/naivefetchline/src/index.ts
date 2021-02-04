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
  try {
    const response = await fetch(filepath)
    const buffer = await response.arrayBuffer()
    const decoder = new TextDecoder(encoding)
    const text = decoder.decode(buffer)
    const re: RegExp =
      typeof delimiter === 'string'
        ? new RegExp(escapeRegExp(delimiter), 'g')
        : delimiter
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
