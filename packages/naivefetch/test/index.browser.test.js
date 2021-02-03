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

// lastlineELEL: '56787961303311646283996346460422090106105779458151', // last non-empty line in Node.js' fs/http and Deno&browser's fetch, but empty line in Deno fs and Deno&browser's naivefetch
// linecount: 20002, // 20001 in Node.js and Deno&browser's fetch, but 20002 including the empty line in Deno fs and Deno's naivefetch

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
    const iter = readlineiter(path, false)

    assertEquals((await iter.next()).value, firstline)
  })

  test(`${filename} linecount and lastline (includeLastEmptyLine=true (default))`, async () => {
    const lines = await iterator2array(readlineiter(path))
    const l = lines.length

    assertEquals(l, lastLineIsEmpty ? linecountELEL + 1 : linecountELEL)

    assertEquals(lines[l - 1], lastLineIsEmpty ? '' : lastlineELEL)
  })

  test(`${filename} linecount and lastline (includeLastEmptyLine=false)`, async () => {
    const lines = await iterator2array(readlineiter(path, false))
    const l = lines.length

    assertEquals(l, linecountELEL)

    assertEquals(lines[l - 1], lastlineELEL)
  })
}
