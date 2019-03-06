const applyWebRoot = require('../../src/lib/applyWebRoot')

const config = {
  WEB_ROOT: 'WEB_ROOT',
  ENV: 'production',
}

const configWithSlash = {
  WEB_ROOT: '/WEB_ROOT/',
  ENV: 'production',
}

module.exports = [
  {
    fn: applyWebRoot(config, 'href="/testing'),
    expect: 'href="/WEB_ROOT/testing',
    info: 'adds WEB_ROOT to <a href=""',
  },
  {
    fn: applyWebRoot(config, 'src="/testing'),
    expect: 'src="/WEB_ROOT/testing',
    info: 'adds WEB_ROOT to <link src=""',
  },
  {
    fn: applyWebRoot({ ...config, WEB_ROOT: '/' }, 'href="/testing'),
    expect: 'href="/testing',
    info: 'does nothing if WEB_ROOT === /',
  },
  {
    fn: applyWebRoot({ ...config, ENV: 'development' }, 'href="/testing'),
    expect: 'href="/testing',
    info: 'does nothing in development',
  },
  {
    fn: applyWebRoot(config, 'href="/testing'),
    expect: 'href="/WEB_ROOT/testing',
    info: 'works if slashes do not exist',
  },
  {
    fn: applyWebRoot(configWithSlash, 'href="/testing'),
    expect: 'href="/WEB_ROOT/testing',
    info: 'works if slashes already exist',
  },
  {
    fn: applyWebRoot(config, 'href="http://testing.com'),
    expect: 'href="http://testing.com',
    info: 'does nothing to external links',
  },
  {
    fn: applyWebRoot(config, 'href="#testing'),
    expect: 'href="#testing',
    info: 'does nothing to hash links',
  },
]
