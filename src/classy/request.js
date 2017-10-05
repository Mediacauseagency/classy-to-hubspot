const R = require('ramda')
const request = require('request')
const baseUrl = require('./baseUrl')
const writeError = require('../helpers/writeError')('history/classy-api-errors.json')
const {successMsg} = require('../helpers/loggers')

module.exports = (options, callback, msg) => {
  request(R.merge({
    baseUrl,
    json: true
  }, options), function (_, _, body) {
    if (body.error) return writeError(body.error)
    msg && successMsg(`${msg(body)}`)
    callback(body)
  })
}
