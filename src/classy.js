const R = require('ramda')
const request = require('request')
const baseUrl = 'https://api.classy.org'

let token = ''

// helpers
const getDateTime = () => new Date().toUTCString()
const log = msg => console.log(`${getDateTime()} `, msg)
const errMsg = err => log(`❌  ${err}`)
const successMsg = success => log(`✅  ${success}`)
const pageMsg = (page, resource) => `retrieved page ${page} of ${resource}.`

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


const postToken = (cb) => {
  req({
    method: 'POST',
    url: '/oauth2/auth',
    form: {
      grant_type: 'client_credentials',
      client_id: process.env.CLASSY_ID,
      client_secret: process.env.CLASSY_SECRET
    }
  }, (resp) => {
      // set token globally so we don't have to keep passing it around
      token = resp.body.access_token
      cb()
    }, () => 'requested access token.')
}

const getNextPage = (results, resource, cb) => (resp) => {
  const body = resp.body
  const nextPageUrl = body.next_page_url
  const updatedResults = R.concat(results, resp.body.data)
  if (nextPageUrl) {
    get({
      url: nextPageUrl.split(baseUrl)[1],
      cb: getNextPage(updatedResults, resource, cb),
      msg: (body) => pageMsg(body.current_page, resource)
    })
  } else {
    successMsg(`retrieved all pages for ${resource}`)
    cb(updatedResults)
  }
}

const get = ({url, cb, msg, queryObj}) => {
  req({
    method: 'GET',
    url,
    qs: R.merge({
      per_page: 100 // max number of results per page
    }, queryObj || {}),
    auth: {bearer: token}
  }, cb, msg)
}

const getAllPages = ({url, resource, cb, queryObj}) => (resp) => {
  const results = []
  get({
    url,
    cb: getNextPage(results, resource, cb),
    msg: () => pageMsg('1', resource),
    queryObj
  })
}

const init = () => {
  log('🤖  connecting to Classy API...')
  postToken(
    getAllPages({
      url: `2.0/organizations/${process.env.CLASSY_ORG_ID}/transactions`,
      resource: 'transactions',
      cb: x => console.log(x),
      queryObj: {
        fields: 'campaign_id,created_at,total_gross_amount,supporter',
        'with': 'supporter'
      }
    })
  )
}

module.exports = init()
