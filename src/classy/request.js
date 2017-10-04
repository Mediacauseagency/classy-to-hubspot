const R = require('ramda')
const request = require('request')
const baseUrl = require('./baseUrl')
const writeError = require('../helpers/writeError')('history/classy-api-errors.json')
const {successMsg} = require('../helpers/loggers')

// a wrapper for request that sets defaults and handles err and resp
module.exports = (options, callback, msg) => {
  request(R.merge({
    baseUrl,
    json: true
  }, options), function (_, _, body) {
    if (body.error) return writeError(body.error)
    successMsg(`${msg(body)}`)
    callback(body)
  })
}
