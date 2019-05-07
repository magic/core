#!/usr/bin/env node

const cli = require('@magic/cli')

const args = {
  options: [
    ['--help', '-help', 'help', '--h', '-h'],
    ['--no-mangle-names'],
    ['--keep-dead-code', '--keep-dead'],
    ['--keep-console'],
    ['--keep-debugger', '--keep-debug'],
    ['--no-minify'],
    ['--keep-client'],
    ['--watch', '-w'],
  ],
  env: [[['--production', '--prod', '--p', '-p'], 'NODE_ENV', 'production']],
  commands: [['serve', 'dev', 'development', 'start'], 'clean', 'connect', 'publish', 'build'],
  help: {
    name: 'magic',
    header: 'static and serverless page generator',
    commands: {
      start: 'starts magic dev env, same as npm run dev',
      dev: 'prepare and transpile, then serve app from memory',
      build: 'builds the client app',
      serve: 'build and serve the bundle',
      clean: 'delete public dir',
      connect: 'connect to github (only needs to be done once)',
      publish: 'publish to github',
    },
    options: {
      '--keep-console': 'keep console.log in production javascript',
      '--no-mangle-names': 'do not mangle names of variables and functions',
      '--keep-dead-code': 'do not remove dead code',
      '--keep-debugger': 'do not remove debugger statements from js',
      '--no-minify': 'do not minify js',
      '--keep-client': 'keeps the unminifed .__browserify_empty.js',
      '--watch': 'watch additional directories',
    },
    example: `
production:
NODE_ENV=production magic [...TASKS]

dev, watch src directory:
magic dev --watch src
`,
  },
}

const res = cli(args)

const run = require('./cluster')
run(res)
