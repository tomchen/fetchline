import http from 'http'
import https from 'https'
import readline from 'readline'

/**
 * Fetch and read remote text file line by line over HTTP(S) with Node.js
 *
 * @param filepath - URL of the text file
 *
 * @returns An asynchronous iterable iterator containing each line in string from the text file
 */
export default async function* getfileline(
  filepath: string
): AsyncIterableIterator<string> {
  let h: typeof http | typeof https
  const protocol = new URL(filepath).protocol
  if (protocol === 'http:') {
    h = http
  } else if (protocol === 'https:') {
    h = https
  } else {
    throw new Error(
      'Invalid protocol. The URL must start with "http://" or "https://"'
    )
  }

  try {
    const rla: AsyncIterableIterator<string> = await new Promise(
      (resolve, reject) => {
        h.get(filepath, async (res) => {
          const rl = readline.createInterface({
            input: res,
            crlfDelay: Infinity,
          })
          resolve(rl[Symbol.asyncIterator]())
        }).on('error', (error) => {
          reject(error)
        })
      }
    )
    for await (const line of rla) {
      yield line
    }
  } catch (error) {
    throw error
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export = getfileline
