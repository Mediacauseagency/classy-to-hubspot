const R = require('ramda')
const request = require('request')
const writeError = require('../helpers/writeError')('history/hubspot-api-errors.json')
const {successMsg} = require('../helpers/loggers')

const baseUrl = 'https://forms.hubspot.com'
const path = `/uploads/form/v2/${process.env.HUBSPOT_HUB_ID}/${process.env.HUBSPOT_FORM_ID}`

// a wrapper for request that sets defaults and handles err and resp
module.exports = (form, callback, msg) => {
  request.post({
    url: baseUrl + path,
    form
  }, function (err, resp, body) {
    if (err) return writeError(err)
    successMsg(`${msg(body)}`)
    callback(body)
  })
}
