const test = (desc, func) => {
  ;(async () => {
    try {
      await func()
      console.log(
        `%cPASS%c ${desc}`,
        'background-color: green; color: white; padding: 0 0.4em;',
        'color: green;'
      )
    } catch (error) {
      console.log(
        `%cFAIL%c ${desc}`,
        'background-color: red; color: white; padding: 0 0.4em;',
        'color: red;'
      )
      console.log(error)
    }
  })()
}

const assertEquals = (v1, v2) => {
  if (v1 !== v2) {
    throw new Error(`${v1.toString()} and ${v2.toString()} are not equal!`)
  }
}

// "ELEL" means "Excluding Last Empty Line"

const filesToTest = [
  {
    filename: 'lf',
    path:
      'https://raw.githubusercontent.com/tomchen/fetchline/main/testfile/lf',
    firstline: '3.',
    lastLineIsEmpty: false,
    lastlineELEL: '56787961303311646283996346460422090106105779458151',
    linecountELEL: 20001,
  },
  {
    filename: 'lf_finalnewline',
    path:
      'https://raw.githubusercontent.com/tomchen/fetchline/main/testfile/lf_finalnewline',
    firstline: '3.',
    lastLineIsEmpty: true,
    lastlineELEL: '56787961303311646283996346460422090106105779458151',
    linecountELEL: 20001,
  },
  {
    filename: 'crlf',
    path:
      'https://raw.githubusercontent.com/tomchen/fetchline/main/testfile/crlf',
    firstline: '3.',
    lastLineIsEmpty: false,
    lastlineELEL: '56787961303311646283996346460422090106105779458151',
    linecountELEL: 20001,
  },
  {
    filename: 'crlf_finalnewline',
    path:
      'https://raw.githubusercontent.com/tomchen/fetchline/main/testfile/crlf_finalnewline',
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
  test(`${filename} firstline`, async () => {
    const iter = fetchline(path)

    assertEquals((await iter.next()).value, firstline)
  })

  test(`${filename} linecount and lastline (includeLastEmptyLine=true (default))`, async () => {
    const iter = fetchline(path)

    const lines = await iterator2array(iter)

    const l = lines.length

    assertEquals(l, lastLineIsEmpty ? linecountELEL + 1 : linecountELEL)

    assertEquals(lines[l - 1], lastLineIsEmpty ? '' : lastlineELEL)
  })

  test(`${filename} linecount and lastline (includeLastEmptyLine=false)`, async () => {
    const iter = fetchline(path, { includeLastEmptyLine: false })

    const lines = await iterator2array(iter)

    const l = lines.length

    assertEquals(l, linecountELEL)

    assertEquals(lines[l - 1], lastlineELEL)
  })
}
