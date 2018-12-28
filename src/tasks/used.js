const used = {
  selectors: (str, selector, sep = '"', nope = '<') => {
    return str
      .split(selector)
      .map(s => s.split(sep)[0])
      .filter(s => !s.startsWith(nope))
      .filter(s => s)
  },
  tags: str => used.selectors(str, '<', /(>|\s)/, '/').filter(s => !s.startsWith('!')),
  classes: str => used.selectors(str, 'class="'),
  ids: str => used.selectors(str, 'id="'),
}

module.exports = used
