const postToken = require('./postToken')
const getAllPages = require('./getAllPages')
const transactionFields = require('./transactionFields')

const dict = require('../helpers/dictionary')
const {log} = require('../helpers/loggers')

const getAllCampaigns = (formatData) => () => {
  getAllPages({
    resource: 'campaigns',
    cb: getAllTransactions(formatData),
    queryObj: {
      fields: 'id,name'
    }
  })
}

const getAllTransactions = (formatData) => (campaignData) => {
  getAllPages({
    resource: 'transactions',
    cb: formatData(dict({data: campaignData, key: 'id', val: 'name'})),
    queryObj: {
      fields: transactionFields.join(','),
      'with': 'supporter'
    }
  })
}

const init = (formatData) => {
  log('🤖  connecting to Classy API...')
  postToken(getAllCampaigns(formatData))
}

module.exports = init
