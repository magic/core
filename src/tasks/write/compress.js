const path = require('path')
const zip = require('node-zopfli-es')

const { getFiles, fs } = require('../../lib')
const zippable = '.css.js.html.json.xml.pdf.doc.docx.xls.xlsx.ppt.pptx.odt.csv.text.txt.ico'

const compress = async () =>
  await Promise.all(
    (await getFiles(config.DIR.PUBLIC))
      .filter(file => zippable.includes(path.extname(file)))
      .map(async file => {
        const fileContent = await fs.readFile(file)
        const zipped = await zip.gzip(fileContent)
        await fs.writeFile(`${file}.gz`, zipped)
      }),
  )

module.exports = compress
