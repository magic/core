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

if (hasArgv() || is.empty(cmds)) {
  console.log(`
magic - static and serverless page generator

usage:
magic [TASKS]...

production tests:
NODE_ENV=production magic [...TASKS]

available tasks:
start   - starts magic dev env, same as npm run dev
dev     - prepare and transpile, then serve app from memory
build   - builds the client app
serve   - build and serve the bundle
clean   - delete public dir
connect - connect to github (only needs to be done once)
publish - publish to github

help    - this help text
`)
  process.exit()
}

const run = require('./cluster.js')
run(cmds)
