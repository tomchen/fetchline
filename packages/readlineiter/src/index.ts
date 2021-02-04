import * as fs from 'fs'
import * as readline from 'readline'

/**
 * Read text file line by line
 *
 * With Node.js `fs` lib. To be used for Node.js to read local file
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
