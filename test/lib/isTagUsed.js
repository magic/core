const isTagUsed = require('../../src/lib/isTagUsed')

module.exports = [
  {
    fn: () => isTagUsed('string including,tag.View')('tag'),
    expect: true,
    info: 'expect true if tag exists',
  },
  {
    fn: () => isTagUsed('string including[tag(')('tag'),
    expect: true,
    info: 'expect true if tag exists',
  },
  {
    fn: () => isTagUsed('string including(tag)')('tag'),
    expect: true,
    info: 'expect true if tag exists',
  },
  {
    fn: () => isTagUsed('string including tag')('tag'),
    expect: false,
    info: 'expect false if tag exists but is not a component',
  },
]
