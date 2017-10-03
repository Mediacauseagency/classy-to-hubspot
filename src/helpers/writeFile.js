const fs = require('fs')
const {errMsg} = require('./loggers')

const write = (path, content, cb) => {
  fs.writeFile(path, content, function (err) {
    if (err) return errMsg(err)
    cb && cb(content, path)
  })
}

module.exports = write
