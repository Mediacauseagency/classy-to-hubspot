const R = require('ramda')
const request = require('request')
const baseUrl = 'https://api.classy.org'

const getDateTime = () => new Date().toUTCString()

const log = msg => console.log(`${getDateTime()} `, msg)

const  handleErr = err => {
  // todo: write to error-log.json
  log(`❌  ${err}`)
}

// a wrapper for request that sets defaults and handles err and resp
function req(options, callback, successMsgAction){
  request(R.merge({
    baseUrl,
    json: true
  }, options), function(err, resp){
    if(err) return handleErr(err)
    log(`✅  Successfully ${successMsgAction}`)
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

const getNextPage = (token) => (resp) => {
  const body = resp.body
  console.log(body)
  const nextPageUrl = body.next_page_url
  if (nextPageUrl) {
    getTransations({
      url: nextPageUrl.split(baseUrl)[1],
      cb: getNextPage(token),
      msg: 'retrieving page.',
      token
    })
  } else {
  }
}

function getTransations ({url, cb, msg, token}) {
  req({
    method: 'GET',
    url,
    qs: {
      'with': 'supporter',
      fields: 'member_name,supporter',
      per_page: 100
    },
    auth: {bearer: token}
  }, cb, msg)
}

function getAllTransactions (resp) {
  const token = resp.body.access_token
  getTransations({
    url: `2.0/organizations/${process.env.CLASSY_ORG_ID}/transactions`,
    cb: getNextPage(token),
    msg: 'retrieving page.',
    token
  })
}


// todo: use run-waterfall to better organize callbacks
function init () {
  log('🤖  connecting to Classy API...')
  getToken(getAllTransactions)
}

module.exports = init()
