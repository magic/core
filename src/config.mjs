import child_process from 'child_process'
import path from 'path'

import cases from '@magic/cases'
import deep from '@magic/deep'
import error from '@magic/error'
import fs from '@magic/fs'
import log from '@magic/log'
import is from '@magic/types'

import colors from './themes/colors.mjs'

import { replacePathSepForImport } from './lib/index.mjs'

export const runConfig = async (args = {}) => {
  let conf = {}
  const confPath = replacePathSepForImport(path.join(process.cwd(), 'config.mjs'), path.sep)

  try {
    const { default: imported } = await import(confPath)
    conf = imported
  } catch (e) {
    log.warn('no local conf file found.')
  }

  // make sure conf.ROOT starts with or is equal to process.cwd()
  if (!conf.ROOT) {
    conf.ROOT = process.cwd()
  } else if (!conf.ROOT.startsWith(process.cwd())) {
    conf.ROOT = path.resolve(process.cwd(), conf.ROOT)
  }

  // object to collect various directories in.
  conf.DIR = conf.DIR || {}

  // change to change the name of magic.js and magic.css
  conf.CLIENT_LIB_NAME = conf.CLIENT_LIB_NAME || 'magic'

  conf.NODE_MODULES = conf.NODE_MODULES || `${process.cwd()}${path.sep}node_modules`

  // name of service-worker client file
  conf.CLIENT_SERVICE_WORKER_NAME = conf.CLIENT_SERVICE_WORKER_NAME || 'service-worker'

  // the host to serve this @magic app at
  conf.HOST = conf.HOST || 'localhost'

  // the port to serve this @magic app at
  conf.PORT = conf.PORT || 2323

  // the URL this app will be served at
  conf.URL = conf.URL || false

  // the CNAME of this app. domain.tld
  conf.CNAME = conf.hasOwnProperty('CNAME') ? conf.CNAME : false

  // set to false to not emit a robots.txt file
  conf.ROBOTS_TXT = conf.hasOwnProperty('ROBOTS_TXT') ? conf.ROBOTS_TXT : true

  // set to false to not emit a sitemap.xml file
  conf.SITEMAP = conf.hasOwnProperty('SITEMAP') ? conf.SITEMAP : true

  // the pages directory with page files to build
  const PAGES = path.join(conf.ROOT, 'pages')

  // the output dir that files get written to
  const PUBLIC = path.join(process.cwd(), conf.PUBLIC || conf.DIR.PUBLIC || 'docs')

  // assets dir, can include themes, modules, libraries
  const ASSETS = path.join(conf.ROOT, 'assets')
  // module dir, modules get imported from here
  const MODULES = path.join(ASSETS, 'modules')
  // static directory, files in this dir get copied to conf.PUBLIC
  const STATIC = path.join(ASSETS, 'static')

  // themes dir, files in this dir get used as themes
  const THEMES = path.join(ASSETS, 'themes')
  // API dir for server side lambdas.
  const API = path.join(process.cwd(), conf.API_DIR || 'api')

  // global css variables that get used by @magic/css
  const THEME_VARS = conf.THEME_VARS || {}
  if (!THEME_VARS.colors) {
    THEME_VARS.colors = colors
  } else {
    THEME_VARS.colors = {
      ...colors,
      ...THEME_VARS.colors,
    }
  }

  // name of the file with all sri hashes
  conf.HASH_FILE_NAME = conf.HASH_FILE_NAME || 'sri-hashes.json'

  try {
    const hashPath = path.join(PUBLIC, conf.HASH_FILE_NAME)
    const content = await fs.readFile(hashPath, 'utf8')
    conf.HASHES = JSON.parse(content)
  } catch (e) {
    if (e.code === 'ENOENT') {
      conf.HASHES = {}
    } else {
      throw error(e)
    }
  }

  conf.INCLUDED_HASH_EXTENSIONS = conf.INCLUDED_HASH_EXTENSIONS || ['.txt', '.xml']

  // the following files are zippable
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

  conf.THEME = conf.THEME || []

  // those are image formats.
  const IMAGES = ['jpg', 'jpeg', 'png', 'svg', 'gif']

  conf = deep.merge(conf, {
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

  // get environment settings for prod and dev
  conf.IS_PROD = conf.ENV === 'production'
  conf.IS_DEV = conf.ENV === 'development'

  conf.IGNORED_STATIC = conf.IGNORED_STATIC || []

  if (is.string(conf.IGNORED_STATIC)) {
    conf.IGNORED_STATIC = [conf.IGNORED_STATIC]
  }

  conf.IGNORED_STATIC = conf.IGNORED_STATIC.map(st => {
    if (!st.startsWith('.')) {
      st = '.' + st
    }
    return st
  })

  // find WEB_ROOT manually from git.
  // show warning if this has to be done, needs a few hundred ms
  if (!conf.WEB_ROOT || !conf.URL) {
    const startTime = new Date().getTime()
    const stdout = child_process.execSync('git remote -v').toString()

    let remote = stdout.split('\n')[1].split(/(\t| )/gim)[2]

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
    if (!conf.WEB_ROOT) {
      conf.WEB_ROOT = `/${repo}/`
    }
    conf.URL = remote
    const timeSpent = new Date().getTime() - startTime
    conf.URL_WARNING = timeSpent
  }

  // blog support
  if (conf.BLOG_DIR) {
    if (!conf.BLOG_DIR.startsWith(conf.ROOT)) {
      conf.BLOG_DIR = path.join(conf.ROOT, conf.BLOG_DIR)
    }
  }

  // the directory used to save temporary build files
  conf.TMP_DIR = conf.TMP_DIR || '.tmp'
  if (!conf.TMP_DIR.startsWith(process.cwd())) {
    conf.TMP_DIR = path.join(process.cwd(), '.tmp')
  }

  // an array of @magic-modules that get appended to the body
  conf.HOIST = conf.HOIST || []

  // set to true to get babel build info
  conf.BABEL = conf.BABEL || {}

  conf.BABEL = {
    DEBUG: false,
    REMOVE_CHECK_PROPS: conf.IS_PROD,
    MINIFY: conf.IS_PROD && !is.defined(args.noMinify),
    USE_PRESETS: true,
    KEEP_COMMENTS: conf.IS_DEV,
    ...conf.BABEL,
  }

  Object.entries(args).map(([k, v]) => {
    const snaked = cases.snakeCaps(k)
    conf[snaked] = v
  })

  return conf
}
