import path from 'path'

import error from '@magic/error'
import fs from '@magic/fs'
import log from '@magic/log'

import { xc } from '../lib/index.mjs'

const url = new URL(import.meta.url)
const dirName = path.dirname(url.pathname)

const ssl = async () => {
  const privFilename = path.join(dirName, 'priv.pem')
  const certFilename = path.join(dirName, 'cert.pem')

  let keyExists = false
  try {
    await fs.stat(privFilename)
    keyExists = true
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw error(e)
    }
  }

  let certExists = false
  try {
    await fs.stat(certFilename)
    const certExists = true
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw error(e)
    }
  }
  if (certExists && keyExists) {
    return {
      key: await fs.readFile(privFilename),
      cert: await fs.readFile(certFilename),
    }
  } else if (!keyExists && !certExists) {
    log.warn('both cert and key missing. generating')
    const opensslCmd = `openssl \
req -x509 \
-newkey rsa:2048 \
-nodes -sha256 \
-subj '/CN=localhost' \
-keyout ${privFilename} \
-out ${certFilename}
`
    await xc(opensslCmd)

    return await ssl()
  } else if (certExists) {
    log.error('Missing Files', privFilename)
  } else if (keyExists) {
    log.error('Missing Files', certFilename)
  }
}

export default ssl
