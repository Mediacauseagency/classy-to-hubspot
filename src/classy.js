const R = require('ramda')
const request = require('request')
const baseUrl = 'https://api.classy.org'

const getDateTime = () => new Date().toUTCString()

const log = msg => console.log(`${getDateTime()} `, msg)

const errMsg = err => log(`❌  ${err}`)
const successMsg = success => log(`✅  ${success}`)

const  handleErr = err => {
  // todo: write to error-log.json
  errMsg(err)
}

// a wrapper for request that sets defaults and handles err and resp
function req(options, callback, msg){
  request(R.merge({
    baseUrl,
    json: true
  }, options), function(err, resp){
    if(err) return handleErr(err)
    successMsg(`${msg(resp.body)}`)
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
  }, cb, () => 'requested access token.')
}

const pageMsg = (page) => `retrieved page ${page}.`

const getNextPage = (token, results) => (resp) => {
  const body = resp.body
  const nextPageUrl = body.next_page_url
  const updatedResults = R.concat(results, resp.body.data)
  if (nextPageUrl) {
    getTransations({
      url: nextPageUrl.split(baseUrl)[1],
      cb: getNextPage(token, updatedResults),
      msg: (body) => pageMsg(body.current_page),
      token
    })
  } else {
    successMsg('retrieved all pages.')
    console.log(updatedResults)
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
  const results = []
  getTransations({
    url: `2.0/organizations/${process.env.CLASSY_ORG_ID}/transactions`,
    cb: getNextPage(token, results),
    msg: () => pageMsg('1'),
    token
  })
}

// todo: use run-waterfall to better organize callbacks
function init () {
  log('🤖  connecting to Classy API...')
  getToken(getAllTransactions)
}

module.exports = init()
