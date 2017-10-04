const R = require('ramda')
const moment = require('moment')
const formatCurrency = require('currency-formatter').format

const onlyDigits = (st='') => st.replace(/\D/g, '')

const dollarsToCents = st => Number(onlyDigits(st))

const getSupporterId = obj => R.path(['supporter', 'id'], obj)

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

  const constructHistory = (history, obj) => {
    const string = [
      moment(obj.created_at).format('MM/DD/YY'),
      formatCurrency(obj.total_gross_amount, {code: 'USD'}),
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
    return formatCurrency(amount * 0.01, {code: 'USD'})
  }

  const x = R.reduce((acc, obj) => {
    const supporterId = getSupporterId(obj)
    const supporter = acc[supporterId]
    const history = constructHistory(supporter.history, obj)
    const totalDonations = calculateTotalDonations(supporter.total_donations_amount, obj.total_gross_amount)
    const updatedSupporter = R.merge(supporter, {
      history,
      total_donations_amount: totalDonations
    })
    return R.assoc([supporterId], updatedSupporter, acc)
  }, supportersDict, transactionsWithSupporters)

  debugger

  return []


}

module.exports = (campaigns, cb) => (transactions) => {
  cb(format(campaigns, transactions))
}
