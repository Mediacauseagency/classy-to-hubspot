const R = require('ramda')
const request = require('request')
const writeError = require('../helpers/writeError')('history/hubspot-api-errors.json')
const {successMsg} = require('../helpers/loggers')

const url = `https://api.hubapi.com/contacts/v1/contact/batch/?hapikey=${process.env.HUBSPOT_API_KEY}`

module.exports = (body) => {
  request.post({
    url,
    body,
    json: true
  }, function (err, resp, body={}) {
    if (body.status === 'error') return writeError(body)
    successMsg('Hubspot success')
  })
}
