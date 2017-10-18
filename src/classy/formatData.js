const R = require('ramda')
const moment = require('moment')

const usd = require('../helpers/usd')
const addStringNumbers = require('../helpers/addStringNumbers')
const normalizePhone = require('../helpers/addStringNumbers')

const getSupporterId = obj => R.path(['supporter', 'id'], obj)

const constructHistory = (campaigns, history, obj) => {
  const string = [
    '-',
    moment(obj.created_at).utc().format('MM/DD/YY'),
    usd(obj.total_gross_amount),
    campaigns[obj.campaign_id] ? campaigns[obj.campaign_id]: false,
    obj.recurring_donation_plan_id ? '(Recurring)' : false
  ].filter(Boolean).join(' ')
  return history ? (history + '\n' + string) : string
}

const formatLastDonation = date => moment(date).utc().startOf('day').format('x')

const format = (campaigns, transactions) => {

  const transactionsWithSupporters = R.filter(
    R.path(['supporter', 'email_address'])
  , transactions)

  const supportersDict = R.reduce((acc, obj) => {
      const s = obj.supporter
      const supporter = {
        firstname: s.first_name,
        lastname: s.last_name,
        email: s.email_address,
        phone: normalizePhone(s.phone),
        address: (s.address1 || '') + (s.address2 ? ` ${s.address2}` : ''),
        city: s.city,
        zip: s.postal_code,
        country: s.country,
      }
      return R.assoc([getSupporterId(obj)], supporter, acc)
  }, {}, transactionsWithSupporters)

  const supportersWithTransactions = R.reduce((acc, obj) => {
    const supporterId = getSupporterId(obj)
    const supporter = acc[supporterId]
    const campaign = campaigns[obj.campaign_id]
    const lastCampaign = (campaign && !supporter.last_campaign) 
      ? campaign 
      : supporter.last_campaign
    const lastDonationDate = (!supporter.last_donation_date)
      ? formatLastDonation(obj.created_at)
      : supporter.last_donation_date
    const history = constructHistory(campaigns, supporter.donation_history, obj)
    const totalDonationsCount = history ? history.split('\n').length : 0
    const totalDonations = addStringNumbers(
      supporter.total_amount_of_classy_donations, 
      obj.total_gross_amount
    )
    const updates = {
      donation_history: history,
      last_campaign: lastCampaign,
      last_donation_date: lastDonationDate,
      total_amount_of_classy_donations: totalDonations,
      total_number_of_classy_donations: totalDonationsCount
    }
    const updatedSupporter = R.merge(supporter, updates)
    return R.assoc([supporterId], updatedSupporter, acc)
  }, supportersDict, transactionsWithSupporters)

  return  R.map(s => {
    return {
      email: s.email,
      properties: R.map(k => ({
        property: k,
        value: s[k]
      }), R.keys(s))
    }
  }, R.values(supportersWithTransactions))
}

module.exports = (campaigns, cb) => (transactions) => {
  cb(format(campaigns, transactions))
}
