#!/usr/bin/env node

const path = require('path')

const spawn = require('@magic/cli')

spawn([path.join(__dirname, './bin.mjs')])
