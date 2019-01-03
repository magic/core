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

available tasks:
start   - starts magic dev env:
dev     - (build watch serve and NODE_ENV === development)

help    - this help text
  `)
  process.exit()
}

const tasks = ['clean', 'watch', 'build', 'serve', 'zip', 'connect', 'publish']
const cmds = {}
tasks
  .filter(task => process.argv.includes(task))
  .forEach(task => {
    cmds[task] = true
  })

if (process.argv.includes('dev') || process.argv.includes('development')) {
  cmds.serve = true
}

const run = require('./index.js')
run(cmds)
