const R = require('ramda')
const postToken = require('./postToken')
const getAllPages = require('./getAllPages')
const transactionFields = require('./transactionFields')

const writeToJson = require('../helpers/writeToJson')
const {log} = require('../helpers/loggers')

const getAllCampaigns = (finalCb) => () => {
  getAllPages({
    url: `2.0/organizations/${process.env.CLASSY_ORG_ID}/campaigns`,
    resource: 'campaigns',
    cb: getAllTransactions(finalCb),
    queryObj: {
      fields: 'id,name'
    }
  })
}

const getAllTransactions = (finalCb) => (campaignData) => {
  // creates an object where the keys are the campaign ids and the values are the campain names
  const campaignDict = R.reduce((acc, val) =>
      R.assoc([val.id], val.name, acc)
  , {}, campaignData || [])
  getAllPages({
    url: `2.0/organizations/${process.env.CLASSY_ORG_ID}/transactions`,
    resource: 'transactions',
    cb: finalCb(campaignDict),
    queryObj: {
      fields: transactionFields.join(','),
      'with': 'supporter'
    }
  })
}

const init = (finalCb) => {
  log('🤖  connecting to Classy API...')
  postToken(getAllCampaigns(finalCb))
}

module.exports = init
