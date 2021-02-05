import { BufReader, readLines } from 'https://deno.land/std/io/bufio.ts'

/**
 * Read local text file line by line with Deno
 *
 * @param filepath - Path of the text file
 *
 * @returns An asynchronous iterable iterator containing each line in string from the text file
 */
export default async function* (
  filepath: string
): AsyncIterableIterator<string> {
  const file = await Deno.open(filepath, { read: true })
  try {
    const bufReader = new BufReader(file)
    for await (const line of readLines(bufReader)) {
      yield line
    }
  } finally {
    Deno.close(file.rid)
  }
}
