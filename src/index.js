// First, get various API keys and info from .env and assign them to process.env.
require('dotenv').config()
const R = require('ramda')

// Helpers
const dict = require('./helpers/dictionary')
const log = require('./helpers/loggers').log
const delayedMap = require('./helpers/delayedMap')

// Classy
const postToken = require('./classy/postToken')
const getAllPages = require('./classy/getAllPages')
const transactionFields = require('./classy/transactionFields')
const formatData = require('./classy/formatData')

// HubSpot
const postContacts = require('./hubspot/postContacts')

// HubSpot recommends sending no more then 100 contacts at once for bulk
// updating/creating. So if there are more then 100 items, we break them into
// chunks of 100 and send each chunk every second until they are all sent.
const postContactsInChunks = (formattedData) => {
  if (!formattedData) return false
  if (formattedData.length > 100) {
    delayedMap(1000, R.splitEvery(100, formattedData), postContacts)
  } else {
    postContacts(formattedData)
  }
}

// The only campaign data we get from the transactions response
// is the campaign id. So to get the campaign name, we get all
// of the campaigns' ids and names and create a dictionary with them.
const getAllCampaigns = () => {
  getAllPages({
    resource: 'campaigns',
    cb: getAllTransactions,
    queryObj: { fields: 'id,name' }
  })
}

const getAllTransactions = (campaignData) => {
  const queryObj = {
    fields: transactionFields.join(','),
    sort: 'created_at:desc',
    'with': 'supporter'
  }
  getAllPages({
    resource: 'transactions',
    cb: formatData(
      dict({data: campaignData, key: 'id', val: 'name'}),
      postContactsInChunks
    ),
    queryObj
  })
}

const init = () => {
  log('🤖  Initializing...')
  postToken(getAllCampaigns)
}

init()

module.exports = init
