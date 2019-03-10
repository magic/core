const { fs } = require('../lib')
const { exec } = require('child_process')
const util = require('util')
const path = require('path')
const xc = util.promisify(exec)

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
    console.log('both cert and key missing. generating')
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
    console.log(`${privFilename} missing`)
  } else if (keyExists) {
    console.log(`${certFilename} missing`)
  }
}

module.exports = ssl
