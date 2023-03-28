const fs = require('fs')
const path = require('path')
const { start } = require('repl')

const xmlPLaylist = process.argv[2]
if (xmlPLaylist === undefined) {
  console.log('please supply valid xml file')
  process.exit(1)
}
console.log(xmlPLaylist)
if (!xmlPLaylist.includes('.xml')) {
  console.log('not an xml file')
  process.exit(1)
}
const playlistName = path.basename(xmlPLaylist.slice(0, -4))

if (fs.existsSync(xmlPLaylist) === false) {
  console.log('file not found')
  process.exit(1)
}

const data = fs.readFileSync(xmlPLaylist, 'utf-8')
if (!data.includes('<key>Location</key><string>')) {
  console.log('not an apple music playlist')
  process.exit(1)
}
const folderName = playlistName
if (!fs.existsSync(folderName)) {
  fs.mkdirSync(folderName)
  console.log('folder created')
}

const dataString = data
const dataSplits = dataString.split('\n')
const arrayPath = []
for (const dataSplit of dataSplits) {
  if (dataSplit.includes('<key>Location</key><string>')) {
    const removeFront = dataSplit.slice(30)
    const removeEnd = removeFront.slice(0, -9)
    const fuckPercentTwenty = removeEnd.replaceAll('%20', ' ')
    const basename = path.basename(fuckPercentTwenty)
    if (!fs.existsSync(playlistName + '/' + basename)) {
      fs.copyFileSync(fuckPercentTwenty, playlistName + '/' + basename)
    } else {
      let newFileName = basename
      let unique = false
      while (!unique) {
        newFileName = '_' + newFileName
        if (!fs.existsSync(playlistName + '/' + newFileName)) {
          fs.copyFileSync(fuckPercentTwenty, playlistName + '/' + newFileName)
          unique = true
        }
      }
    }
  }
}