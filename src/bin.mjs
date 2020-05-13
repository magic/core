#!/usr/bin/env node

import cli from '@magic/cli'

import { runCluster } from './index.mjs'

const args = {
  options: [
    ['--help', '-help', 'help', '--h', '-h'],
    '--no-minify',
    ['--watch', '-w'],
    '--keep-client',
    '--no-mangle-names',
    '--keep-console',
    '--keep-dead-code',
    '--keep-debugger',
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
      publish: 'publish to github (only needed if publishing to different branch)',
      connect: 'connect to github (only needs to be done once)',
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

create development bundles && watch src directory:
magic dev --watch src
`,
  },
}

const run = async () => {
  const res = cli(args)

  runCluster(res)
}

run()
