module.exports = {
  style: {
    '.Pre': {
      display: 'block',
      fontFamily: 'monospace',
      whiteSpace: 'pre',
      margin: '1em 0',

      '.tag': {
        color: 'green',
      },
      '.keyword': {
        color: 'purple',
      },
      '.builtin': {
        color: 'yellow',
      },
      '.string': {
        color: '#dd8f00 !important',
      },
      '.colon': {
        color: 'turquoise',
      },
      '.boolean': {
        color: 'blue',
      },
      '.hyper': {
        color: 'blueviolet',
      },
    },
  },

  View: content => {
    const format = content => {
      const keywords = `
let this long package float
goto private class if short
while protected with debugger case
continue volatile interface

instanceof super synchronized throw
extends final export throws
try import double enum

boolean abstract function
implements typeof transient break
void static default do

switch int new async native
else delete null public var
in return for get const char
finally catch await byte
`

      const builtins = `
Array Object String Number RegExp Null Symbol
Set WeakSet Map WeakMap
JSON
Int8Array Uint8Array Uint8ClampedArray
Int16Array Uint16Array
Int32Array Uint32Array
Float32Array Float64Array
`

      const booleans = `true false`

      const hyperWords = `state actions`

      const known = '[object HTMLDivElement]'
      const tags = {
        canvas: 1,
        video: 1,
      }

      const isTag = word => {
        if (tags.hasOwnProperty(word)) {
          return true
        } else {
          try {
            const ele =
              typeof global !== 'undefined'
                ? Array.from(global.keys).includes(word)
                : document.createElement(word).toString() === known

            if (ele) {
              tags[word] = true
              return true
            }
          } catch (e) {}
        }
      }

      content = content.split(/'(.*?)'/g)

      content = content.map((string, i) => {
        if (i % 2) {
          return span({ class: 'string' }, `'${string}'`)
        }

        if (typeof string === 'string') {
          string = string.split(/\b/g).map(word => {
            let cl = ''
            if (isTag(word)) {
              cl = 'tag'
            } else if (keywords.includes(word)) {
              cl = 'keyword'
            } else if (builtins.includes(word)) {
              cl = 'builtin'
            } else if (hyperWords.includes(word)) {
              cl = 'hyper'
            } else if (booleans.includes(word)) {
              cl = 'boolean'
            } else if (word.endsWith(':')) {
              cl = 'colon'
            }

            if (cl) {
              word = span({ class: cl }, word)
            }

            return word
          })
        }
        return string
      })

      return content
    }

    return div({ class: 'Pre' }, format(content))
  },
}
