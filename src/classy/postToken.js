const req = require('./request')

module.exports = (cb) => {
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
    process.env.CLASSY_ACCESS_TOKEN = resp.body.access_token
    cb()
  }, () => 'requested access token.')
}
