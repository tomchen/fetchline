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
  includeLastEmptyLine = true
): AsyncIterableIterator<string> {
  try {
    const response = await fetch(filepath)
    const text = await response.text()
    const re = /\r\n|\n|\r/g
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
