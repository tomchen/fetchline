import { assertEquals } from 'https://deno.land/std@0.85.0/testing/asserts.ts'
import fetchline from '../src/index.ts'

// "ELEL" means "Excluding Last Empty Line"

const filesToTest = [
  {
    filename: 'lf',
    path:
      'https://raw.githubusercontent.com/tomchen/readlineiter/main/testfile/lf',
    firstline: '3.',
    lastLineIsEmpty: false,
    lastlineELEL: '56787961303311646283996346460422090106105779458151',
    linecountELEL: 20001,
  },
  {
    filename: 'lf_finalnewline',
    path:
      'https://raw.githubusercontent.com/tomchen/readlineiter/main/testfile/lf_finalnewline',
    firstline: '3.',
    lastLineIsEmpty: true,
    lastlineELEL: '56787961303311646283996346460422090106105779458151',
    linecountELEL: 20001,
  },
  {
    filename: 'crlf',
    path:
      'https://raw.githubusercontent.com/tomchen/readlineiter/main/testfile/crlf',
    firstline: '3.',
    lastLineIsEmpty: false,
    lastlineELEL: '56787961303311646283996346460422090106105779458151',
    linecountELEL: 20001,
  },
  {
    filename: 'crlf_finalnewline',
    path:
      'https://raw.githubusercontent.com/tomchen/readlineiter/main/testfile/crlf_finalnewline',
    firstline: '3.',
    lastLineIsEmpty: true,
    lastlineELEL: '56787961303311646283996346460422090106105779458151',
    linecountELEL: 20001,
  },
]

async function iterator2array(
  asynciter: AsyncIterableIterator<string>
): Promise<string[]> {
  const ret = []
  for await (const x of asynciter) {
    ret.push(x)
  }
  return ret
}

for (const {
  filename,
  path,
  firstline,
  lastLineIsEmpty,
  lastlineELEL,
  linecountELEL,
} of filesToTest) {
  Deno.test(`${filename} firstline`, async () => {
    const iter: AsyncIterableIterator<string> = fetchline(path)

    assertEquals((await iter.next()).value, firstline)

    for await (const _ of iter) {
      //Deno needs to iterate until the until to close the file
    }
  })

  Deno.test(
    `${filename} linecount and lastline (includeLastEmptyLine=true (default))`,
    async () => {
      const iter: AsyncIterableIterator<string> = fetchline(path)

      const lines = await iterator2array(iter)

      for await (const _ of iter) {
        //Deno needs to iterate until the until to close the file
      }

      const l = lines.length

      assertEquals(l, lastLineIsEmpty ? linecountELEL + 1 : linecountELEL)

      assertEquals(lines[l - 1], lastLineIsEmpty ? '' : lastlineELEL)
    }
  )

  Deno.test(
    `${filename} linecount and lastline (includeLastEmptyLine=false)`,
    async () => {
      const iter: AsyncIterableIterator<string> = fetchline(path, {
        includeLastEmptyLine: false,
      })

      const lines = await iterator2array(iter)

      for await (const _ of iter) {
        //Deno needs to iterate until the until to close the file
      }

      const l = lines.length

      assertEquals(l, linecountELEL)

      assertEquals(lines[l - 1], lastlineELEL)
    }
  )
}
