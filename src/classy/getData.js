const postToken = require('./postToken')
const getAllPages = require('./getAllPages')
const transactionFields = require('./transactionFields')

const dict = require('../helpers/dictionary')
const {log} = require('../helpers/loggers')

const getAllCampaigns = (cb) => () => {
  getAllPages({
    cb,
    resource: 'campaigns',
    queryObj: { fields: 'id,name' }
  })
}

const getAllTransactions = (cb) => (campaignData) => {
  getAllPages({
    resource: 'transactions',
    cb: cb(dict({data: campaignData, key: 'id', val: 'name'})),
    queryObj: {
      fields: transactionFields.join(','),
      'with': 'supporter'
    }
  })
}

const init = (formatData) => {
  log('🤖  connecting to Classy API...')
  postToken(
    getAllCampaigns(
      getAllTransactions(formatData)
    )
  )
}

module.exports = init
