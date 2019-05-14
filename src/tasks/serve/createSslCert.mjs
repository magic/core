import { fs, xc } from '../lib/index.mjs'
import path from 'path'
import log from '@magic/log'

const url = new URL(import.meta.url)
const dirName = path.dirname(url.pathname)

const ssl = async () => {
  const privFilename = path.join(dirName, 'priv.pem')
  const certFilename = path.join(dirName, 'cert.pem')
  const keyExists = await fs.exists(privFilename)
  const certExists = await fs.exists(certFilename)

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
    log.error(`${privFilename} missing`)
  } else if (keyExists) {
    log.error(`${certFilename} missing`)
  }
}

export default ssl
