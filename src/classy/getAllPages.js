const R = require('ramda')
const req = require('./request')
const baseUrl = require('./baseUrl')
const {successMsg} = require('../helpers/loggers')

// helpers
const pageMsg = (page, resource) => `retrieved page ${page} of ${resource}.`
const resourceUrl = resource => `2.0/organizations/${process.env.CLASSY_ORG_ID}/${resource}`

const getNextPage = (results, resource, cb) => (body) => {
  const nextPageUrl = body.next_page_url
  const allResults = R.concat(results, body.data || [])
  // results are always paginated and we want to make sure to get results from all pages
  if (!R.isEmpty(allResults) && nextPageUrl) {
    get({
      url: nextPageUrl.split(baseUrl)[1],
      cb: getNextPage(allResults, resource, cb),
      msg: (body) => pageMsg(body.current_page, resource)
    })
  } else {
    successMsg(`retrieved all pages for ${resource}`)
    // call the callback after we're done getting all of the paginated results
    cb(allResults)
  }
}

const get = ({url, cb, msg, queryObj}) => {
  req({
    method: 'GET',
    url,
    qs: R.merge({
      per_page: 100 // max number of results per page
    }, queryObj || {}),
    auth: {bearer: process.env.CLASSY_ACCESS_TOKEN}
  }, cb, msg)
}

const getAllPages = ({url, resource, cb, queryObj}) => {
  const results = []
  get({
    url: resourceUrl(resource),
    cb: getNextPage(results, resource, cb),
    msg: () => pageMsg('1', resource),
    queryObj
  })
}

module.exports = getAllPages
