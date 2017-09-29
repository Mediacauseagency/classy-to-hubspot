const request = require('request')
const baseUrl = 'https://api.classy.org/'

function getToken (cb) {
  request({
    method: 'POST',
    baseUrl,
    url: '/oauth2/auth',
    form: {
      grant_type: 'client_credentials',
      client_id: process.env.CLASSY_ID,
      client_secret: process.env.CLASSY_SECRET
    }
  }, function (err, resp) {
    if (err) return console.log(err)
    cb(JSON.parse(resp.body).access_token)
  })
}

function getSupporters (token) {
  request({
    method: 'GET',
    baseUrl,
    url: `2.0/organizations/${process.env.CLASSY_ORG_ID}/supporters`,
    auth: {bearer: token}
  }, function (err, resp) {
    if (err) return console.log(err)
    console.log(JSON.parse(resp.body))
  })
}

// todo: use run-waterfall to better organize callbacks
function init () {
  getToken(function (token) {
    getSupporters(token)
  })
}

module.exports = init()
