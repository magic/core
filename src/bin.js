#!/usr/bin/env node

const is = require('@magic/types')

const hasArgv = () =>
  process.argv.indexOf('-h') > -1 ||
  process.argv.indexOf('--h') > -1 ||
  process.argv.indexOf('-help') > -1 ||
  process.argv.indexOf('--help') > -1 ||
  process.argv.indexOf('help') > -1

const tasks = ['clean', 'connect', 'publish', 'build', 'serve']
const cmds = {}
tasks
  .filter(task => process.argv.includes(task))
  .forEach(task => {
    cmds[task] = true
  })

const devAliases = ['dev', 'development', 'start']
if (devAliases.some(arg => process.argv.includes(arg))) {
  cmds.serve = true
}

// first index in nested flag array is the default,
// all following items are aliases
const flags = [
  ['--no-mangle-names'],
  ['--keep-dead-code', '--keep-dead'],
  ['--keep-console'],
  ['--keep-debugger', '--keep-debug'],
  ['--no-minify'],
]

process.argv = process.argv.map(arg => {
  flags
    .filter(flag => arg !== flag[0] && flag.some(f => f === arg))
    .forEach(flag => {
      arg = flag[0]
    })

  return arg
})

if (hasArgv() || is.empty(cmds)) {
  console.log(`
magic - static and serverless page generator

usage:
magic [TASKS]...

production:
NODE_ENV=production magic [...TASKS]

available tasks:
start   - starts magic dev env, same as npm run dev
dev     - prepare and transpile, then serve app from memory
build   - builds the client app
serve   - build and serve the bundle
clean   - delete public dir
connect - connect to github (only needs to be done once)
publish - publish to github

command line flags:
--keep-console    - keep console.log in production javascript
--no-mangle-names - do not mangle names of variables and functions
--keep-dead-code  - do not remove dead code
--keep-debugger   - do not remove debugger statements from js
--no-minify       - do not minify js


help    - this help text
`)
  process.exit()
}

const run = require('./cluster.js')
run(cmds)
