const test = require('ava')
const fetchline = require('../src/index')

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

async function iterator2array(asynciter) {
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
  test(`${filename} firstline`, async (t) => {
    const iter = fetchline(path)

    t.is((await iter.next()).value, firstline)
  })

  test(`${filename} linecount and lastline (includeLastEmptyLine=true (default))`, async (t) => {
    const iter = fetchline(path)

    const lines = await iterator2array(iter)

    const l = lines.length

    t.is(l, lastLineIsEmpty ? linecountELEL + 1 : linecountELEL)

    t.is(lines[l - 1], lastLineIsEmpty ? '' : lastlineELEL)
  })

  test(`${filename} linecount and lastline (includeLastEmptyLine=false)`, async (t) => {
    const iter = fetchline(path, { includeLastEmptyLine: false })

    const lines = await iterator2array(iter)

    const l = lines.length

    t.is(l, linecountELEL)

    t.is(lines[l - 1], lastlineELEL)
  })
}
