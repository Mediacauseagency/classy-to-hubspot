const fs = require('fs')
const {errMsg, successMsg} = require('./loggers')

const writeToJson = (path, content) => {
  fs.writeFile(`${path}.json`, JSON.stringify(content), function (err) {
    if (err) return errMsg(err)
    successMsg(`${path}.json was saved.`)
  })
}

module.exports = writeToJson
