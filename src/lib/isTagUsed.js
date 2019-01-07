const isTagUsed = str => fn => {
  const incs = [
    new RegExp(`(\\s+|\\,|\\n|\\[|\\()${fn}(\\(|\\)|\\,|.View)`, 'g'),
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
