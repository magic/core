import cp from 'child_process'
import path from 'path'
import deep from '@magic/deep'
import log from '@magic/log'

export const runConfig = async () => {
  let conf = {}
  const confPath = path.join(process.cwd(), 'config.mjs')
  try {
    const { default: imported } = await import(confPath)
    conf = imported
  } catch (e) {
    log.warn('no local conf file found.')
  }

  if (!conf.ROOT) {
    conf.ROOT = process.cwd()
  } else if (!conf.ROOT.startsWith(process.cwd())) {
    conf.ROOT = path.resolve(process.cwd(), conf.ROOT)
  }

  conf.DIR = conf.DIR || {}

  conf.CLIENT_LIB_NAME = conf.CLIENT_LIB_NAME || 'magic'

  conf.HOST = conf.HOST || 'localhost'
  conf.PORT = conf.PORT || 2323

  conf.URL = conf.URL || false
  conf.CNAME = conf.hasOwnProperty('CNAME') ? conf.CNAME : false
  conf.ROBOTS_TXT = conf.hasOwnProperty('ROBOTS_TXT') ? conf.ROBOTS_TXT : true
  conf.SITEMAP = conf.hasOwnProperty('SITEMAP') ? conf.SITEMAP : true

  const PAGES = path.join(conf.ROOT, 'pages')
  const PUBLIC = path.join(process.cwd(), conf.PUBLIC || conf.DIR.PUBLIC || 'public')
  const ASSETS = path.join(conf.ROOT, 'assets')
  const MODULES = path.join(conf.ROOT, 'modules')
  const STATIC = path.join(ASSETS, 'static')
  const THEMES = path.join(ASSETS, 'themes')
  const API = path.join(process.cwd(), conf.DIR.API || 'api')

  conf.HASH_FILE_NAME = conf.HASH_FILE_NAME || 'sri-hashes.json'

  try {
    const hashPath = path.join(PUBLIC, conf.HASH_FILE_NAME)
    conf.HASHES = await import(hashPath)
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      conf.HASHES = {
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

  if (!conf.WEB_ROOT || !conf.URL) {
    const startTime = new Date().getTime()
    const stdout = cp.execSync('git remote -v').toString()

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

  return conf
}

export const config = runConfig()

export default config
