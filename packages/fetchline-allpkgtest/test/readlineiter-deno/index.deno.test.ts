import { assertEquals } from 'https://deno.land/std@0.85.0/testing/asserts.ts'
import fetchline from 'https://raw.githubusercontent.com/tomchen/fetchline/main/packages/readlineiter-deno/mod.ts'

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
    lastline: '',
    linecount: 20002,
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
    lastline: '',
    linecount: 20002,
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
    const iter: AsyncIterableIterator<string> = fetchline(file.path)

    assertEquals((await iter.next()).value, file.firstline)

    for await (const _ of iter) {
      //Deno needs to iterate until the until to close the file
    }
  })

  Deno.test(`${file.filename} linecount and lastline`, async () => {
    const lines = await iterator2array(fetchline(file.path))
    const l = lines.length

    assertEquals(l, file.linecount)

    assertEquals(lines[l - 1], file.lastline)
  })
}
