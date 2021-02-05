import * as fs from 'fs'
import * as readline from 'readline'

/**
 * Read local text file line by line with Node.js
 *
 * @param filepath - Path of the text file
 *
 * @returns An asynchronous iterable iterator containing each line in string from the text file
 */
export default (filepath: string): AsyncIterableIterator<string> => {
  const fileStream = fs.createReadStream(filepath, {
    encoding: 'utf-8',
  })
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })
  return rl[Symbol.asyncIterator]()
}
