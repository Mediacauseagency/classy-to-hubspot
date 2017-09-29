const request = require('request')
const baseUrl = 'https://api.classy.org/'

function getToken (cb) {
  return request({
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

function init () {
  getToken(function (token) {
    console.log(token)
  })
}

module.exports = init()
