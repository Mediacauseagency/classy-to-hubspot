const R = require('ramda')
const request = require('request')

const getDateTime = () => new Date().toUTCString()

const log = msg => console.log(`${getDateTime()} `, msg)

const  handleErr = err => {
  // todo: write to error-log.json
  log(`❌  ${err}`)
}

// a wrapper for request that sets defaults and handles err and resp
function req(options, callback, successMsgAction){
  request(R.merge({
    baseUrl: 'https://api.classy.org/',
    json: true
  }, options), function(err, resp){
    if(err) return handleErr(err)
    log(`✅  Successfully ${successMsgAction}.`)
    callback(resp)
  })
}

function getToken (cb) {
  req({
    method: 'POST',
    url: '/oauth2/auth',
    form: {
      grant_type: 'client_credentials',
      client_id: process.env.CLASSY_ID,
      client_secret: process.env.CLASSY_SECRET
    }
  }, cb, 'requested access token.')
}

function getSupporters (resp) {
  req({
    method: 'GET',
    url: `2.0/organizations/${process.env.CLASSY_ORG_ID}/supporters`,
    auth: {bearer: resp.body.access_token}
  }, function (resp) {
    console.log(resp.body)
  }, 'retrieved supporter data.')
}

// todo: use run-waterfall to better organize callbacks
function init () {
  log('🤖  connecting to Classy API...')
  getToken(getSupporters)
}

module.exports = init()
