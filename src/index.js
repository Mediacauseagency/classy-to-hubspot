// first, get various API keys and info from .env and assign them to the process.env
require('dotenv').config()
const R = require('ramda')
const toCsv = require('jsonexport')
const cron = require('node-cron')
const write = require('./helpers/write')

const postToken = require('./classy/postToken')
const getAllPages = require('./classy/getAllPages')
const transactionFields = require('./classy/transactionFields')
const formatData = require('./classy/formatData')

const dict = require('./helpers/dictionary')
const {log} = require('./helpers/loggers')

const sendToHubSpot = (formattedData) =>  {
  const ids = R.pluck('transaction_id', formattedData)
  console.log(ids)
}

const getAllCampaigns = () => {
  getAllPages({
    resource: 'campaigns',
    cb: getAllTransactions,
    queryObj: { fields: 'id,name' }
  })
}

const getAllTransactions = (campaignData) => {
  getAllPages({
    resource: 'transactions',
    cb: formatData(sendToHubSpot, dict({data: campaignData, key: 'id', val: 'name'})),
    queryObj: {
      fields: transactionFields.join(','),
      'with': 'supporter'
    }
  })
}

log('🤖  connecting to Classy API...')
postToken(getAllCampaigns)

// cron.schedule('*/4 * * * * *', () => console.log('blink'))

