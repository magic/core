const isTagUsed = str => fn => {
  // this function will search str for different kinds of module usage.
  // before the string it will look for whitespace, comma, newline and function call ends ()
  // after the string it will look for opening brackets, closing brackets, comma, .UpperCasedNames

  const incs = [
    new RegExp(`(\\s+|\\,|\\n|\\[|\\()${fn}(\\(|\\)|\\,|.[A-Z][a-zA-Z0-9]*)`, 'g'),
    // `,${fn}(`,
    // `\n${fn}(`,
    // `[${fn}(`,
    // `(${fn})`,
    // `(${fn}(`,
    // `${fn}.View`,
    // ` ${fn},`,
    // `${fn},`
  ].some(t => str.match(t))

  return incs
}

module.exports = isTagUsed
