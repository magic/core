#!/usr/bin/env node

const hasArgv = () =>
  process.argv.indexOf('-h') > -1 ||
  process.argv.indexOf('--h') > -1 ||
  process.argv.indexOf('-help') > -1 ||
  process.argv.indexOf('--help') > -1 ||
  process.argv.indexOf('help') > -1

if (hasArgv()) {
  console.log(`
magic - static and serverless page generator

usage:
magic [TASKS]...

production tests:
NODE_ENV=production magic [...TASKS]

available tasks:
start   - starts magic dev env, same as npm run dev
dev     - run BUILD and SERVE
build   - builds the bundle.
serve   - build and serve the bundle
clean   - delete public dir
connect - connect to github (only needs to be done once)
publish - publish to github

help    - this help text
`)
  process.exit()
}

const tasks = ['clean', 'connect', 'publish', 'build', 'serve']
const cmds = {}
tasks
  .filter(task => process.argv.includes(task))
  .forEach(task => {
    cmds[task] = true
  })

if (process.argv.includes('dev') || process.argv.includes('development')) {
  cmds.serve = true
}

const run = require('./cluster.js')
run(cmds)
