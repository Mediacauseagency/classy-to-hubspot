const R = require('ramda')
const request = require('request')
const baseUrl = require('./baseUrl')
const updateFile = require('../helpers/updateFile')
const addDateKeyAndConcat = require('../helpers/addDateKeyAndConcat')
const {errMsg, successMsg} = require('../helpers/loggers')

const handleErr = err => {
  const errorHistoryPath = 'history/classy-api-errors.json'
  updateFile(errorHistoryPath, err, addDateKeyAndConcat('error'))
  errMsg('Error: See ' + errorHistoryPath)
}

// a wrapper for request that sets defaults and handles err and resp
module.exports = (options, callback, msg) => {
  request(R.merge({
    baseUrl,
    json: true
  }, options), function (undefined, resp, body) {
    if (body.error) return handleErr(body.error)
    successMsg(`${msg(body)}`)
    callback(body)
  })
}
