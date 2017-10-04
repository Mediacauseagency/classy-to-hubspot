const updateFile = require('./updateFile')
const addDateKeyAndConcat = require('./addDateKeyAndConcat')
const {errMsg} = require('./loggers')

module.exports = (path) => (err) => {
  updateFile(path, err, addDateKeyAndConcat('error'))
  errMsg('Error: See ' + path)
}
