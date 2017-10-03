const fs = require('fs')
const {errMsg, writeMsg} = require('./loggers')

const write = (path, content, cb) => {
  fs.writeFile(path, content, function (err) {
    if (err) return errMsg(err)
    writeMsg(`${path} was saved.`)
    cb && cb(content, path)
  })
}

module.exports = write
