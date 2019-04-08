const isTagUsed = str => fn => {
  // this function will search str for different kinds of module usage.
  // before the string it will look for whitespace, comma, newline and function call ends ()
  // after the string it will look for opening brackets, closing brackets, comma, .UpperCasedNames

  // remove text in strings
  str = str
    .replace(/".*"/, '')
    .replace(/'.*'/, '')
    .replace(/`.*`/, '')

  const tag = new RegExp(`(\\s+|\\,|\\n|\\[|\\()${fn}(\\(|\\)|\\,|\.[A-Z][a-zA-Z0-9]*)`, 'gm')
  const includes = str.match(tag)

  return includes
}

module.exports = isTagUsed
