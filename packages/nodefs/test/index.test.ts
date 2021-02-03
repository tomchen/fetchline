import test from 'ava'
import readlineiter from '../src/index'

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
    lastline: '56787961303311646283996346460422090106105779458151', // last non-empty line in Node.js' fs/http and Deno&browser's fetch, but empty line in Deno fs and Deno&browser's naivefetch
    linecount: 20001, // 20001 in Node.js' fs/http and Deno&browser's fetch, but 20002 including the empty line in Deno fs and Deno&browser's naivefetch
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
    lastline: '56787961303311646283996346460422090106105779458151', // last non-empty line in Node.js' fs/http and Deno&browser's fetch, but empty line in Deno fs and Deno&browser's naivefetch
    linecount: 20001, // 20001 in Node.js' fs/http and Deno&browser's fetch, but 20002 including the empty line in Deno fs and Deno&browser's naivefetch
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
  test(`${file.filename} firstline`, async (t) => {
    const iter: AsyncIterableIterator<string> = readlineiter(file.path)

    t.is((await iter.next()).value, file.firstline)
  })

  test(`${file.filename} linecount and lastline`, async (t) => {
    const lines = await iterator2array(readlineiter(file.path))
    const l = lines.length

    t.is(l, file.linecount)

    t.is(lines[l - 1], file.lastline)
  })
}
