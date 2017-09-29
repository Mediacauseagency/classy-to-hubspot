const R = require('ramda')
const request = require('request')
const baseUrl = 'https://api.classy.org'

// helpers
const getDateTime = () => new Date().toUTCString()
const log = msg => console.log(`${getDateTime()} `, msg)
const errMsg = err => log(`❌  ${err}`)
const successMsg = success => log(`✅  ${success}`)
const pageMsg = (page) => `retrieved page ${page}.`

let token = ''

const  handleErr = err => {
  // todo: write to error-log.json
  errMsg(err)
}

// a wrapper for request that sets defaults and handles err and resp
const req = (options, callback, msg) => {
  request(R.merge({
    baseUrl,
    json: true
  }, options), function(err, resp){
    if(err) return handleErr(err)
    successMsg(`${msg(resp.body)}`)
    callback(resp)
  })
}

const getToken = (cb) => {
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

const getNextPageOfTransactions = (results) => (resp) => {
  const body = resp.body
  const nextPageUrl = body.next_page_url
  const updatedResults = R.concat(results, resp.body.data)
  if (nextPageUrl) {
    transactionsRequest({
      url: nextPageUrl.split(baseUrl)[1],
      cb: getNextPageOfTransactions(updatedResults),
      msg: (body) => pageMsg(body.current_page)
    })
  } else {
    successMsg('retrieved all pages.')
    formatTransactions(updatedResults)
  }
}

const formatTransactions = (data) => {
  console.log(data[1])
}

const transactionsRequest = ({url, cb, msg}) => {
  req({
    method: 'GET',
    url,
    qs: {
      'with': 'campaign',
      per_page: 100
    },
    auth: {bearer: token}
  }, cb, msg)
}

const getAllTransactions = (resp) => {
  token = resp.body.access_token
  const results = []
  transactionsRequest({
    url: `2.0/organizations/${process.env.CLASSY_ORG_ID}/transactions`,
    cb: getNextPageOfTransactions(results),
    msg: () => pageMsg('1')
  })
}

// todo: use run-waterfall to better organize callbacks
const init = () => {
  log('🤖  connecting to Classy API...')
  getToken(getAllTransactions)
}

module.exports = init()
