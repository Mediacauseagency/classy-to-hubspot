const R = require('ramda')
const req = require('./request')
const baseUrl = require('./baseUrl')
const {successMsg} = require('../helpers/loggers')

const pageMsg = (page, resource) => `retrieved page ${page} of ${resource}.`

const getNextPage = (results, resource, cb) => (resp) => {
  const body = resp.body
  const nextPageUrl = body.next_page_url
  const updatedResults = R.concat(results, resp.body.data)
  // results are always paginated and we want to make sure to get results from all pages
  if (nextPageUrl) {
    get({
      url: nextPageUrl.split(baseUrl)[1],
      cb: getNextPage(updatedResults, resource, cb),
      msg: (body) => pageMsg(body.current_page, resource)
    })
  } else {
    successMsg(`retrieved all pages for ${resource}`)
    // call the callback after we're done getting all of the paginated results
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
    auth: {bearer: process.env.CLASSY_ACCESS_TOKEN}
  }, cb, msg)
}

const getAllPages = ({url, resource, cb, queryObj}) => {
  const results = []
  get({
    url,
    cb: getNextPage(results, resource, cb),
    msg: () => pageMsg('1', resource),
    queryObj
  })
}

module.exports = getAllPages
