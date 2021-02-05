/**
 * Fetch and read remote text file line by line over HTTP(S) with Node.js or modern browsers
 *
 * @param filepath - URL of the text file
 * @param options - options, including the following three
 * @param options.includeLastEmptyLine - Should it count the last empty line?
 * @param options.encoding - File encoding
 * @param options.delimiter - Line (or other item)'s delimiter / separator
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
