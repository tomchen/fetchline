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
export default function (
  filepath: string,
  {
    includeLastEmptyLine,
    encoding,
    delimiter,
  }?: {
    includeLastEmptyLine?: boolean
    encoding?: string
    delimiter?: string | RegExp
  }
): AsyncIterableIterator<string>
