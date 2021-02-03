import { assertEquals } from 'https://deno.land/std@0.85.0/testing/asserts.ts'
import readlineiter from '../mod.ts'

const filesToTest = [
  {
    filename: 'lf',
    path: '../../testfile/lf',
    firstline: '3.',
    lastline: '56787961303311646283996346460422090106105779458151',
    linecount: 20001,
  },
  {
    filename: 'lf_finalnewline',
    path: '../../testfile/lf_finalnewline',
    firstline: '3.',
    lastline: '', // last non-empty line in Node.js' fs/http and Deno&browser's fetch, but empty line in Deno fs and Deno&browser's naivefetch
    linecount: 20002, // 20001 in Node.js' fs/http and Deno&browser's fetch, but 20002 including the empty line in Deno fs and Deno&browser's naivefetch
  },
  {
    filename: 'crlf',
    path: '../../testfile/crlf',
    firstline: '3.',
    lastline: '56787961303311646283996346460422090106105779458151',
    linecount: 20001,
  },
  {
    filename: 'crlf_finalnewline',
    path: '../../testfile/crlf_finalnewline',
    firstline: '3.',
    lastline: '', // last non-empty line in Node.js' fs/http and Deno&browser's fetch, but empty line in Deno fs and Deno&browser's naivefetch
    linecount: 20002, // 20001 in Node.js' fs/http and Deno&browser's fetch, but 20002 including the empty line in Deno fs and Deno&browser's naivefetch
  },
]

async function iterator2array<T>(asynciter: AsyncIterableIterator<T>): Promise<T[]> {
  const ret: T[] = []
  for await (const x of asynciter) {
    ret.push(x)
  }
  return ret
}

for (const file of filesToTest) {
  Deno.test(`${file.filename} firstline`, async () => {
    const iter: AsyncIterableIterator<string> = readlineiter(file.path)

    assertEquals((await iter.next()).value, file.firstline)

    for await (const _ of iter) {
      //Deno needs to iterate until the until to close the file
    }
  })

  Deno.test(`${file.filename} linecount and lastline`, async () => {
    const lines = await iterator2array(readlineiter(file.path))
    const l = lines.length

    assertEquals(l, file.linecount)

    assertEquals(lines[l - 1], file.lastline)
  })
}
