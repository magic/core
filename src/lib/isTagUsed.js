const isTagUsed = str => fn =>
  str.includes(` ${fn}(`) ||
  str.includes(`,${fn}(`) ||
  str.includes(`\n${fn}(`) ||
  str.includes(`[${fn}(`) ||
  str.includes(`(${fn})`) ||
  str.includes(`(${fn}(`)
module.exports = isTagUsed
