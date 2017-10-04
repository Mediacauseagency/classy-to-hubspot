const R = require('ramda')
const moment = require('moment')
const formatCurrency = require('currency-formatter').format

const usd = amount => formatCurrency(amount, {code: 'USD'})
const onlyDigits = (st='') => st.replace(/\D/g, '')
const dollarsToCents = st => Number(onlyDigits(st))
const getSupporterId = obj => R.path(['supporter', 'id'], obj)

const constructHistory = (campaigns, history, obj) => {
  const string = [
    moment(obj.created_at).format('MM/DD/YY'),
    usd(obj.total_gross_amount),
    Boolean(obj.recurring_donation_plan_id) ? 'Recurring' : false,
    campaigns[obj.campaign_id] ? campaigns[obj.campaign_id]: false,
    '#' + obj.id
  ].filter(Boolean).join(' ')
  return history ? (history + '\n' + string) : string
}

const calculateTotalDonations = (prev, current) => {
  const amount = prev
    ? (dollarsToCents(prev) + dollarsToCents(current))
    : dollarsToCents(current)
  return usd(amount * 0.01)
}

const format = (campaigns, transactions) => {
  const transactionsWithSupporters = R.filter(t => t.supporter, transactions)

  const supportersDict = R.reduce((acc, obj) => {
      const s = obj.supporter
      const supporter = {
        firstname: s.first_name,
        lastname: s.last_name,
        email: s.email_address,
        phone: onlyDigits(s.phone),
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
    const history = constructHistory(campaigns, supporter.history, obj)
    const totalDonations = calculateTotalDonations(supporter.total_donation_amount, obj.total_gross_amount)
    const totalDonationsCount = history ? history.split('\n').length : 0
    const updatedSupporter = R.merge(supporter, {
      donation_history: history,
      total_donation_amount: totalDonations,
      total_number_donations: totalDonationsCount
    })
    return R.assoc([supporterId], updatedSupporter, acc)
  }, supportersDict, transactionsWithSupporters)

  const formattedForHubSpot = R.map(s => {
    return {
      email: s.email,
      properties: R.map(k => ({
        property: k,
        value: s[k]
      }), R.keys(s))
    }
  }, R.values(supportersWithTransactions))

  return formattedForHubSpot
}

module.exports = (campaigns, cb) => (transactions) => {
  cb(format(campaigns, transactions))
}
