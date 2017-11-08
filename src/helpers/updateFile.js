const fs = require('fs')
const writeFile = require('./writeFile')
const writeMsg = require('./loggers').writeMsg

const update = (path, newData, transform, cb) => {
  fs.readFile(path, 'utf8', function (undefined, oldData) {
    writeFile(path, transform(oldData, newData), cb)
    writeMsg(`${path} was ${oldData ? 'updated' : 'created'}.`)
  })
}

module.exports = update
