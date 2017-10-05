// first, get various API keys and info from .env and assign them to the process.env
require('dotenv').config()
const R = require('ramda')
const fs = require('fs')
const moment = require('moment')

const postToken = require('./classy/postToken')
const getAllPages = require('./classy/getAllPages')
const transactionFields = require('./classy/transactionFields')
const formatData = require('./classy/formatData')

const postContacts = require('./hubspot/postContacts')

const dict = require('./helpers/dictionary')
const {log} = require('./helpers/loggers')
const updateFile = require('./helpers/updateFile')
const iso = require('./helpers/iso')
const addDateKeyAndConcat = require('./helpers/addDateKeyAndConcat')
const throttleMap = require('./helpers/throttleMap')

const successHistoryPath = 'history/classy-api-successes.json'

const writeIds = (formattedData) => {
  if (!formattedData) return false
  updateFile(successHistoryPath, `Downloaded transaction data for ${formattedData.length} supporters.`, addDateKeyAndConcat('message'))
  if(formattedData.length > 100) {
    throttleMap(1000, R.splitAt(100, formattedData), postContacts)
  } else {
   postContacts(formattedData)
  }
}

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
    'with': 'supporter',
  }
  getAllPages({
    resource: 'transactions',
    cb: formatData(dict({data: campaignData, key: 'id', val: 'name'}), writeIds),
    queryObj
  })
}

const init = () => {
  log('🤖  connecting to Classy API...')
  postToken(getAllCampaigns)
}

//cron.schedule('0 */30 * * * *', init) 
init()

//const testFormData = {
//}

//postForms(testFormData, x => console.log(x), (body) => body)

