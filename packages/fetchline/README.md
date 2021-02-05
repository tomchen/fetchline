# Fetch line JavaScript packages: read remote or local file line by line as async iterator

Read text file (remote over HTTP(S) or local) line by line as async iterator, with Node, browsers and Deno.

[This GitHub monorepo](https://github.com/tomchen/fetchline/) hosts 6 released npm packages and 1 Deno module. They all serve a similar, simple purpose: read text file line by line and return an asynchronous iterable iterator of strings. They all try to be efficient and fast, and are written in TypeScript. However, their environment / platforms and exact purpose, features and behavior differ.

[![Actions Status](https://github.com/tomchen/fetchline/workflows/Test/badge.svg)](https://github.com/tomchen/fetchline/actions) [![Node.js](https://img.shields.io/badge/node-%3E=12.0-brightgreen.svg)](https://nodejs.org/) [![Deno](https://img.shields.io/badge/deno-%3E=1.2.0-white.svg)](https://deno.land/) [![lerna](https://img.shields.io/badge/monorepo-lerna-cc00ff.svg)](https://lerna.js.org/) [![License](https://img.shields.io/github/license/tomchen/fetchline)](https://github.com/tomchen/fetchline/blob/main/LICENSE)

**TLDR: read the ["Purpose & environment" table](#purpose--environment), pick the package you need, have a look at the [Usage section](#usage), know at least a little bit about JavaScript's [async / await](#async--await), and go ahead to use them.**

## Comparison

### Purpose & environment

<table>
<thead>
  <tr>
    <th rowspan="2">Package / Module Name</th>
    <th rowspan="2" title="Whether it is recommended">Rec?</th>
    <th colspan="3">Fetch remote file over HTTP(S)</th>
    <th colspan="2">Read local file</th>
    <th rowspan="2">Version</th>
  </tr>
  <tr>
    <td align="center"><img src="https://raw.githubusercontent.com/tomchen/fetchline/main/images/node.svg" title="Node.js" alt="Node.js" width="50px" height="50px"></td>
    <td align="center"><img src="https://raw.githubusercontent.com/tomchen/fetchline/main/images/deno.svg" title="Deno" alt="Deno" width="50px" height="50px"></td>
    <td align="center"><img src="https://raw.githubusercontent.com/tomchen/fetchline/main/images/chrome.svg" title="Google Chrome" alt="Google Chrome" width="25px" height="25px"><img src="https://raw.githubusercontent.com/tomchen/fetchline/main/images/firefox.svg" title="Firefox" alt="Firefox" width="25px" height="25px"><img src="https://raw.githubusercontent.com/tomchen/fetchline/main/images/safari.svg" title="Safari" alt="Safari" width="25px" height="25px"><br>
    <img src="https://raw.githubusercontent.com/tomchen/fetchline/main/images/edge.svg" title="Microsoft Edge" alt="Microsoft Edge" width="25px" height="25px"><img src="https://raw.githubusercontent.com/tomchen/fetchline/main/images/opera.svg" title="Opera" alt="Opera" width="25px" height="25px"><img src="https://raw.githubusercontent.com/tomchen/fetchline/main/images/samsung_internet.svg" title="Samsung Internet" alt="Samsung Internet" width="25px" height="25px"></td>
    <td align="center"><img src="https://raw.githubusercontent.com/tomchen/fetchline/main/images/node.svg" title="Node.js" alt="Node.js" width="50px" height="50px"></td>
    <td align="center"><img src="https://raw.githubusercontent.com/tomchen/fetchline/main/images/deno.svg" title="Deno" alt="Deno" width="50px" height="50px"></td>
  </tr>
</thead>
<tbody>
  <tr>
    <td><a href="#fetchline-nodefetchline-isomorphic-fetchline-and-naivefetchline">fetchline</a></td>
    <td align="center" title="Recommended">👍</td>
    <td align="center"></td>
    <td align="center" title="Yes">✅</td>
    <td align="center" title="Yes">✅</td>
    <td align="center"></td>
    <td align="center"></td>
    <td align="center"><a href="https://www.npmjs.com/package/fetchline" title="fetchline's npm page"><img src="https://img.shields.io/npm/v/fetchline?color=green&label=" alt="version number"></a></td>
  </tr>
  <tr>
    <td><a href="#fetchline-nodefetchline-isomorphic-fetchline-and-naivefetchline">nodefetchline</a></td>
    <td align="center" title="Recommended">👍</td>
    <td align="center" title="Yes">✅</td>
    <td align="center"></td>
    <td align="center"></td>
    <td align="center"></td>
    <td align="center"></td>
    <td align="center"><a href="https://www.npmjs.com/package/nodefetchline" title="nodefetchline's npm page"><img src="https://img.shields.io/npm/v/nodefetchline?color=green&label=" alt="version number"></a></td>
  </tr>
  <tr>
    <td><a href="#fetchline-nodefetchline-isomorphic-fetchline-and-naivefetchline">isomorphic-fetchline</a></td>
    <td align="center"></td>
    <td align="center" title="Yes">✅</td>
    <td align="center"></td>
    <td align="center" title="Yes">✅</td>
    <td align="center"></td>
    <td align="center"></td>
    <td align="center"><a href="https://www.npmjs.com/package/isomorphic-fetchline" title="isomorphic-fetchline's npm page"><img src="https://img.shields.io/npm/v/isomorphic-fetchline?color=green&label=" alt="version number"></a></td>
  </tr>
  <tr>
    <td><a href="#fetchline-nodefetchline-isomorphic-fetchline-and-naivefetchline">naivefetchline</a></td>
    <td align="center"></td>
    <td align="center"></td>
    <td align="center" title="Yes">✅</td>
    <td align="center" title="Yes">✅</td>
    <td align="center"></td>
    <td align="center"></td>
    <td align="center"><a href="https://www.npmjs.com/package/naivefetchline" title="naivefetchline's npm page"><img src="https://img.shields.io/npm/v/naivefetchline?color=green&label=" alt="version number"></a></td>
  </tr>
  <tr>
    <td><a href="#readlineiter-readlineiter-for-deno-and-getfileline">getfileline</a></td>
    <td align="center"></td>
    <td align="center" title="Yes">✅</td>
    <td align="center"></td>
    <td align="center"></td>
    <td align="center"></td>
    <td align="center"></td>
    <td align="center"><a href="https://www.npmjs.com/package/getfileline" title="getfileline's npm page"><img src="https://img.shields.io/npm/v/getfileline?color=green&label=" alt="version number"></a></td>
  </tr>
  <tr>
    <td><a href="#readlineiter-readlineiter-for-deno-and-getfileline">readlineiter</a></td>
    <td align="center" title="Recommended">👍</td>
    <td align="center"></td>
    <td align="center"></td>
    <td align="center"></td>
    <td align="center" title="Yes">✅</td>
    <td align="center"></td>
    <td align="center"><a href="https://www.npmjs.com/package/readlineiter" title="readlineiter's npm page"><img src="https://img.shields.io/npm/v/readlineiter?color=green&label=" alt="version number"></a></td>
  </tr>
  <tr>
    <td><a href="#readlineiter-readlineiter-for-deno-and-getfileline">readlineiter for Deno</a></td>
    <td align="center" title="Recommended">👍</td>
    <td align="center"></td>
    <td align="center"></td>
    <td align="center"></td>
    <td align="center"></td>
    <td align="center" title="Yes">✅</td>
    <td align="center"></td>
  </tr>
</tbody>
</table>

If you are not sure, just use the recommended one that has the correct environment and purpose you need.

**Tested:**

* Node.js: ≥ 12
* Deno: ≥ v1.2.0
* Modern browsers (Google Chrome, Firefox, Safari, Microsoft Edge, Opera, Samsung Internet): all latest

## Usage

### fetchline, nodefetchline, isomorphic-fetchline, and naivefetchline

#### Examples

```bash
npm install fetchline
```

```js
import fetchline from 'fetchline'
const lineIterator =
  fetchline('https://raw.githubusercontent.com/tomchen/fetchline/main/testfile/crlf_finalnewline')
// This is the same as:
// fetchline(
//   'https://raw.githubusercontent.com/tomchen/fetchline/main/testfile/crlf_finalnewline',
//   {
//     includeLastEmptyLine: true,
//     encoding: 'utf-8',
//     delimiter: /\r?\n/g,
//   }
// )
;(async () => {
  for await (const line of lineIterator) {
    // do something with `line`
  }
})()
```

Change `'fetchline'` to `nodefetchline`, `isomorphic-fetchline`, or `naivefetchline` if you use these packages instead.

Change the `import` line to syntax like `const nodefetchline = require('nodefetchline')` if you use nodefetchline or isomorphic-fetchline package in Node's CommonJS.

For browsers:

```html
<script src="https://unpkg.com/fetchline/dist/umd"></script>
<script>
fetchline(...) // same as above
</script>
```

#### Details

These four packages have exactly the same interface (parameters and return value):

| Parameter Name                 | Required? | Type                 | Default Value | Description                                  |
| :----------------------------- | :-------- | :------------------- | :------------ | :------------------------------------------- |
| `filepath`                     | Required  | *string*             | *N/A*         | URL or path of the text file                 |
| `options`                      | Optional  | *object*             | `{}`          | options, including the following three       |
| `options.includeLastEmptyLine` | Optional  | *boolean*            | `true`        | Should it count the last empty line?         |
| `options.encoding`             | Optional  | *string*             | `'utf-8'`     | File encoding                                |
| `options.delimiter`            | Optional  | *string* or *RegExp* | `/\r?\n/g`    | Line (or other item)'s delimiter / separator.<br>**NOTE:** do not set it as something like `/\r\n\|\n\|\r/g`, it causes trouble when one of the chunks of a CRLF (`\r\n`)-EOL file ends with CR (`\r`) |

**Return value:** { *AsyncIterableIterator\<string\>* } An asynchronous iterable iterator containing each line in string from the text file

### readlineiter, readlineiter for Deno, and getfileline

They have **similar** interface as the aforementioned fetchline, nodefetchline, isomorphic-fetchline, and naivefetchline, **but do not have the second parameter, `options`**, and everything `options` contains.

```bash
npm install readlineiter
```

```js
import readlineiter from 'readlineiter' // For Deno: import readlineiter from 'https://raw.githubusercontent.com/tomchen/fetchline/main/packages/readlineiter-deno/mod.ts'
const lineIterator = readlineiter(
  'https://raw.githubusercontent.com/tomchen/fetchline/main/testfile/crlf_finalnewline'
)
;(async () => {
  for await (const line of lineIterator) {
    // do something with `line`
  }
})()
```

## Further comparison

### Characteristics

|                       | ASAP  | 0 dependency | TypeScript |
| --------------------- | :---: | :----------: | :--------: |
| fetchline             |   ✅   |      ✅       |     ✅      |
| nodefetchline         |   ✅   |      ✅       |     ✅      |
| isomorphic-fetchline  |   ✅   |      ✅       |  `.d.ts`   |
| naivefetchline        |   ❌   |      ✅       |     ✅      |
| getfileline           |   ✅   |      ✅       |     ✅      |
| readlineiter          |   ✅   |      ✅       |     ✅      |
| readlineiter for Deno |   ✅   |      ✅       |     ✅      |

**ASAP:**

* These remote file requesting libs should resolve with the line text string as soon as possible, i.e. as soon as the chunks that have arrived can form the next complete line
  * Except for naivefetchline that is, well, naïve, I really can't blame it
* The local file reading libs read the file with pointer, rather than get a whole string in memory then split the string

**0 dependency:** no external non-dev dependency for npm packages. Note that:

* Node libraries inevitably use native Node libraries `http` and `https`, or `fs`
* getfileline and readlineiter also use `readline` native lib directly thus are just wrappers, but other packages here use own low-level method
* "readlineiter for Deno" uses Deno Standard Module [`bufio.ts`](https://deno.land/std/io/bufio.ts).

**TypeScript:** the source code is in TypeScript, except for isomorphic-fetchline's source which is in JavaScript but has type definition (`.d.ts`).

As for the production / dist files, these packages are all compiled into different [module versions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) where possible: Node.js' [Common.js](https://en.wikipedia.org/wiki/CommonJS) (which uses `require()`), ES Module (native JS module with `import`), and minified [UMD](https://github.com/umdjs/umd) that is good for browser.

### Parameters amd return value

|                       | `filepath` parameter | `includeLastEmptyLine` option | `encoding` option |                              `delimiter` option                              | Return `AsyncIterableIterator<string>` |
| --------------------- | :------------------: | :---------------------------: | :---------------: | :--------------------------------------------------------------------------: | :------------------------------------: |
| fetchline             |          ✅           |               ✅               |         ✅         |                                      ✅                                       |                   ✅                    |
| nodefetchline         |          ✅           |               ✅               |         ✅         |                                      ✅                                       |                   ✅                    |
| isomorphic-fetchline  |          ✅           |               ✅               |         ✅         |                                      ✅                                       |                   ✅                    |
| naivefetchline        |          ✅           |               ✅               |         ✅         |                                      ✅                                       |                   ✅                    |
| getfileline           |          ✅           |       ❌, always doesn't       |  ❌, always utf-8  | ❌, always EOL detected by [`readline`](https://nodejs.org/api/readline.html) |                   ✅                    |
| readlineiter          |          ✅           |       ❌, always doesn't       |  ❌, always utf-8  | ❌, always EOL detected by [`readline`](https://nodejs.org/api/readline.html) |                   ✅                    |
| readlineiter for Deno |          ✅           |        ❌, always does         |  ❌, always utf-8  |  ❌, always EOL detected by [`bufio.ts`](https://deno.land/std/io/bufio.ts)   |                   ✅                    |

getfileline and readlineiter's delimiter is EOL character detected by [`readline`](https://nodejs.org/api/readline.html) native module with its [`crlfDelay` option](https://nodejs.org/api/readline.html#readline_readline_createinterface_options) set to `Infinity`.

## Tips & thoughts

### `async` / `await`

Of course, you should at least know a little bit about [async / await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), `await asyncIterator.next()` or [`for await of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) before using the packages here. If you don't, click the links to read the article from MDN Web Docs. Basically, you can do this:

```js
;(async () => {
  for await (const line of lineIterator) {
    // do something with `line`
  }
})()
```

Or this:

```js
;(async () => {
  let line
  let isDone
  while (1) {
    ;({ value: line, done: isDone } = await lineIterator.next())
    // do something with `line`
    if (isDone) {
      break
    }
  }
})()
```

### Line-delimited JSON

These packages, especially 'fetchline' (the first one) for browsers, could be helpful for [line-delimited JSON](https://en.wikipedia.org/wiki/JSON_streaming#Line-delimited_JSON) parsing. You could write something like:

```js
import fetchline from 'fetchline'
const lineIterator = fetchline(lineDelimitedJsonUrl)
;(async () => {
  for await (const line of lineIterator) {
    const lineJson = lineJSON.parse(line)
    // do something with `lineJson`
  }
})()
```

### Development

This is a [Lerna](https://lerna.js.org/) powered monorepo with mixed code (TypeScript / JavaScript), mixed module version (CommonsJS, ES Module, UMD) and cross-environment (Node.js, Deno, browsers) support, automated tests with GitHub Actions CI. Look at the root [package.json](https://github.com/tomchen/fetchline/blob/main/package.json) and individual packages' package.json for available scripts, to get started, `yarn` then `yarn bootstrap`. You could also use the repo as an example of Lerna monorepo.
