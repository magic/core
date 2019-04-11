// this function will search str for different kinds of module usage.
// before the string it will look for whitespace, comma, newline and function call ends ()
// after the string it will look for opening brackets, closing brackets, comma, .UpperCasedNames

const isTagUsed = str => fn => {
  // remove text in strings
  str = str
    .replace(/".*"/, '')
    .replace(/'.*'/, '')
    .replace(/`.*`/, '')

  const beforeFn = '(\\s+|\\,|\\n|\\[|\\()'
  const afterFn = '(\\(|\\)|\\,|.[A-Z][a-zA-Z0-9]*)'

  const tag = new RegExp(`${beforeFn}${fn}${afterFn}`, 'gm')
  const includes = str.match(tag)

  return includes === null ? false : includes.length > 0
}

module.exports = isTagUsed
