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


const postForms = require('./hubspot/request')

const dict = require('./helpers/dictionary')
const {log} = require('./helpers/loggers')
const updateFile = require('./helpers/updateFile')
const iso = require('./helpers/iso')
const addDateKeyAndConcat = require('./helpers/addDateKeyAndConcat')
//const throttleMap = require('./helpers/throttleMap')
//const rand = require('./helpers/getRandom')

const successHistoryPath = 'history/classy-api-successes.json'

const writeIds = (formattedData) => {
  const ids = R.pluck('transaction_id', formattedData)
  updateFile(successHistoryPath, ids, addDateKeyAndConcat('ids'))
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
        filter: `created_at>=${moment().subtract(35, 'minutes').format()}`
      })
      : defaultQueryObj
    getAllPages({
      resource: 'transactions',
      cb: formatData(dict({data: campaignData, key: 'id', val: 'name'}), writeIds),
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

//const testFormData = {
  //firstname: 'Yutaka',
  //lastname: 'Houlette',
  //email: 'yutakahoulette@gmail.com',
  //phone: '123456789',
  //address: '123 Apple St. Apt B',
  //city: 'Oakland',
  //state: 'CA',
  //zip: '94606',
  //country: 'USA',
  //donation_date: iso(),
  //donation_campaign_name: 'Test campaign name',
  //single_donation_amount: '1',
  //donation_is_recurring: 'FALSE',
  //donation_is_anonymous: 'FALSE',
//}

// postForms(testFormData, x => console.log(x), (body) => body)
