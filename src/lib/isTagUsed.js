const isTagUsed = str => fn => {
  const incs = [
    ` ${fn}(`,
    `,${fn}(`,
    `\n${fn}(`,
    `[${fn}(`,
    `(${fn})`,
    `(${fn}(`,
  ].some(t => str.includes(t))

  return incs
}

module.exports = isTagUsed
