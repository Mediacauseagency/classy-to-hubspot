const R = require('ramda')
const request = require('request')
const baseUrl = require('./baseUrl')
const {errMsg, successMsg} = require('../helpers/loggers')

const handleErr = err => {
  // todo: write to error-log.json
  errMsg(err)
}

// a wrapper for request that sets defaults and handles err and resp
module.exports = (options, callback, msg) => {
  request(R.merge({
    baseUrl,
    json: true
  }, options), function (err, resp) {
    if (err) return handleErr(err)
    successMsg(`${msg(resp.body)}`)
    callback(resp)
  })
}
