const cp = require('child_process')
const path = require('path')
const deep = require('@magic/deep')
const log = require('@magic/log')

const configPath = path.join(process.cwd(), 'config.js')
let config = {}

try {
  config = require(configPath)
} catch (e) {
  log.warn('no local config file found.')
}
if (!config.ROOT) {
  config.ROOT = process.cwd()
} else if (!config.ROOT.startsWith(process.cwd())) {
  config.ROOT = path.resolve(process.cwd(), config.ROOT)
}

config.DIR = config.DIR || {}

config.CLIENT_LIB_NAME = config.CLIENT_LIB_NAME || 'magic'

config.WEB_ROOT = config.WEB_ROOT || '/'

config.HOST = config.HOST || 'localhost'
config.PORT = config.PORT || 2323

config.URL = config.URL || false
config.CNAME = config.hasOwnProperty('CNAME') ? config.CNAME : false
config.ROBOTS_TXT = config.hasOwnProperty('ROBOTS_TXT') ? config.ROBOTS_TXT : true
config.SITEMAP = config.hasOwnProperty('SITEMAP') ? config.SITEMAP : true

const PAGES = path.join(config.ROOT, 'pages')
const PUBLIC = path.join(process.cwd(), config.PUBLIC || config.DIR.PUBLIC || 'public')
const ASSETS = path.join(config.ROOT, 'assets')
const MODULES = path.join(config.ROOT, 'modules')
const STATIC = path.join(ASSETS, 'static')
const THEMES = path.join(ASSETS, 'themes')
const API = path.join(process.cwd(), config.DIR.API || 'api')

config.HASH_FILE_NAME = config.HASH_FILE_NAME || 'sri-hashes.json'

try {
  const hashPath = path.join(PUBLIC, config.HASH_FILE_NAME)
  config.HASHES = require(hashPath)
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') {
    config.HASHES = {
      pages: {},
      static: {},
    }
  } else {
    throw e
  }
}

const ZIPPABLE = [
  'css',
  'js',
  'html',
  'json',
  'xml',
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'odt',
  'csv',
  'text',
  'txt',
  'ico',
]
const IMAGES = ['jpg', 'jpeg', 'png', 'svg', 'gif']

config = deep.merge(config, {
  DIR: {
    PAGES,
    PUBLIC,
    ASSETS,
    MODULES,
    STATIC,
    THEMES,
    API,
  },
  FILETYPES: {
    ZIPPABLE,
    IMAGES,
  },
  IMAGEMIN: {
    PNG: { quality: [0.95, 1] },
    JPG: { quality: 95 },
    GIF: { optimizationLevel: 3 },
    SVGO: {
      plugins: [
        {
          removeViewBox: false,
        },
      ],
    },
  },
  ENV: process.env.MAGIC_ENV || process.env.NODE_ENV || 'development',
})

if (!config.WEB_ROOT || !config.URL) {
  const startTime = new Date().getTime()
  const stdout = cp.execSync('git remote -v').toString()

  remote = stdout.split('\n')[1].split(/(\t| )/gim)[2]

  let host
  let org
  let repo

  if (remote.startsWith('git')) {
    host = remote.split('@')[1].split('.')[0]
    const [o, r] = remote.split(':')[1].split('/')
    org = o
    repo = r
  } else if (remote.startsWith('http')) {
    host = remote.split('://')[1].split('.')[0]
    const [_, o, r] = remote.replace('://', '').split('/')
    org = o
    repo = r

    if (repo === `${org}.${host}.io`) {
      remote = `${org}.${host}`
    } else {
      remote = `${org}.${host}.io/${repo}`
    }
  }

  if (repo === `${org}.${host}.io`) {
    remote = `${org}.${host}.io`
  } else {
    remote = `${org}.${host}.io/${repo}`
  }
  config.WEB_ROOT = `/${repo}/`
  config.URL = remote
  const timeSpent = new Date().getTime() - startTime
  config.URL_WARNING = timeSpent
}

module.exports = config
