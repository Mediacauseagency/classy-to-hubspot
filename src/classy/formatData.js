const R = require('ramda')

const or = (a, b) => a || b || ''

const format = (campaigns, transactions) => {
  if (!transactions || R.isEmpty(transactions)) return false
  return R.map(t => {
    const supporter = t.supporter || {}
    const address1 = or(supporter.address1, t.billing_address1)
    const address2 = or(supporter.address2, t.billing_address2)
    return {
      firstname: or(supporter.first_name, t.billing_first_name),
      lastname: or(supporter.last_name, t.billing_last_name),
      email: or(supporter.email_address, t.member_email_address),
      phone: or(supporter.phone, t.member_phone).replace(/\D/g, ''),
      address: address1 + (address2 ? ` ${address2}` : ''),
      city: or(supporter.city, t.billing_city),
      state: or(supporter.state, t.billing_state),
      zip: or(supporter.postal_code, t.billing_postal_code),
      country: or(supporter.country, t.billing_country),
      donation_date: t.created_at,
      donation_campaign_name: campaigns[t.campaign_id] || '',
      single_donation_amount: t.total_gross_amount,
      donation_is_recurring: Boolean(t.recurring_donation_plan_id),
      donation_is_anonymous: Boolean(t.is_anonymous),
    }
  }, transactions)
}

module.exports = (campaigns, cb) => (transactions) => {
  cb(format(campaigns, transactions))
}
