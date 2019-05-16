#!/usr/bin/env node

const path = require('path')

const spawn = require('@magic/cli')

const p = path.join(__dirname, 'bin.mjs')
spawn([p])
