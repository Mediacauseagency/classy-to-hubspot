const R = require('ramda')
const request = require('request')
const baseUrl = require('./baseUrl')
const updateFile = require('../helpers/updateFile')
const addDateKeyAndConcat = require('../helpers/addDateKeyAndConcat')
const {errMsg, successMsg} = require('../helpers/loggers')

const handleErr = err => {
  updateFile('history/classy-api-errors.json', err, addDateKeyAndConcat('error'))
  errMsg(err)
}

// a wrapper for request that sets defaults and handles err and resp
module.exports = (options, callback, msg) => {
  request(R.merge({
    baseUrl,
    json: true
  }, options), function (undefined, resp, body) {
    if (body.error) return handleErr(body.error_description)
    successMsg(`${msg(body)}`)
    callback(body)
  })
}
