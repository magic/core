const { fs } = require('../lib')
const { exec } = require('child_process')
const util = require('util')
const path = require('path')
const xc = util.promisify(exec)
const log = require('@magic/log')

const ssl = async () => {
  const privFilename = path.join(__dirname, 'priv.pem')
  const certFilename = path.join(__dirname, 'cert.pem')
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

module.exports = ssl
