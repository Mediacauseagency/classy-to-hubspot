// first, get various API keys and info from .env and assign them to the process.env
require('dotenv').config()
const R = require('ramda')
const cron = require('node-cron')
const fs = require('fs')
const moment = require('moment')

const postToken = require('./classy/postToken')
const getAllPages = require('./classy/getAllPages')
const transactionFields = require('./classy/transactionFields')
const formatData = require('./classy/formatData')

const dict = require('./helpers/dictionary')
const {log} = require('./helpers/loggers')
const updateFile = require('./helpers/updateFile')
const addDateKeyAndConcat = require('./helpers/addDateKeyAndConcat')
// const throttleMap = require('./helpers/throttleMap')
// const rand = require('./helpers/getRandom')

const successHistoryPath = 'history/classy-api-successes.json'

const sendToHubSpot = (formattedData) => {
  const ids = R.pluck('transaction_id', formattedData)
  updateFile(successHistoryPath, ids, addDateKeyAndConcat('ids'))
  // throttleMap(rand(50, 200), formattedData, (x) => console.log(x))
  // TODO send data to hubspot
}

const getAllCampaigns = () => {
  getAllPages({
    resource: 'campaigns',
    cb: getAllTransactions,
    queryObj: { fields: 'id,name' }
  })
}

const getAllTransactions = (campaignData) => {
  fs.readFile(successHistoryPath, 'utf8', (_, data) => {
    const defaultQueryObj = {
      fields: transactionFields.join(','),
      'with': 'supporter'
    }
    const queryObj = data
      ? R.merge(defaultQueryObj, {
        filter: `updated_at>=${moment().subtract(35, 'minutes').format()}`
      })
      : defaultQueryObj
    getAllPages({
      resource: 'transactions',
      cb: formatData(sendToHubSpot, dict({data: campaignData, key: 'id', val: 'name'})),
      queryObj
    })
  })
}

const init = () => {
  log('🤖  connecting to Classy API...')
  postToken(getAllCampaigns)
}

cron.schedule('0 */30 * * * *', init)

init()
