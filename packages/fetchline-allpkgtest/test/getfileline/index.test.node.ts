import test from 'ava'
import fetchline from 'getfileline'

const filesToTest = [
  {
    filename: 'lf',
    path:
      'https://raw.githubusercontent.com/tomchen/fetchline/main/testfile/lf',
    firstline: '3.',
    lastline: '56787961303311646283996346460422090106105779458151',
    linecount: 20001,
  },
  {
    filename: 'lf_finalnewline',
    path:
      'https://raw.githubusercontent.com/tomchen/fetchline/main/testfile/lf_finalnewline',
    firstline: '3.',
    lastline: '56787961303311646283996346460422090106105779458151',
    linecount: 20001,
  },
  {
    filename: 'crlf',
    path:
      'https://raw.githubusercontent.com/tomchen/fetchline/main/testfile/crlf',
    firstline: '3.',
    lastline: '56787961303311646283996346460422090106105779458151',
    linecount: 20001,
  },
  {
    filename: 'crlf_finalnewline',
    path:
      'https://raw.githubusercontent.com/tomchen/fetchline/main/testfile/crlf_finalnewline',
    firstline: '3.',
    lastline: '56787961303311646283996346460422090106105779458151',
    linecount: 20001,
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
    const iter: AsyncIterableIterator<string> = fetchline(file.path)

    t.is((await iter.next()).value, file.firstline)
  })

  test(`${file.filename} linecount and lastline`, async (t) => {
    const lines = await iterator2array(fetchline(file.path))
    const l = lines.length

    t.is(l, file.linecount)

    t.is(lines[l - 1], file.lastline)
  })
}
