const R = require('ramda')
const c = require('../tmp/campaigns.json')
const t = require('../tmp/transactions.json')

const format = (campaigns, transactions) => {
  if (!transactions || R.isEmpty(transactions)) return
  return R.map(t => {
    const supporter = t.supporter || {}
    return {
      first_name: supporter.first_name || t.billing_first_name || '',
      last_name: supporter.last_name || t.billing_last_name || '',
      email_address: supporter.email_address || t.member_email_address || '',
      phone: (supporter.phone || t.member_phone || '').replace(/\D/g,''),
      supporter_id: supporter.id || '',
      address_1: supporter.address1 || t.billing_address1 || '',
      address_2: supporter.address2 || t.billing_address2 || '',
      city: supporter.city || t.billing_city || '',
      state: supporter.state || t.billing_state || '',
      zip: supporter.postal_code || t.billing_postal_code || '',
      country: supporter.country || t.billing_country || '',
      date: t.created_at,
      campaign_id: t.campaign_id || '',
      campaign_name: campaigns[t.campaign_id] || '',
      amount: t.total_gross_amount,
      recurring: Boolean(t.recurring_donation_plan_id),
      anonymous: Boolean(t.is_anonymous),
      payment_method: t.payment_method
    }
  }, transactions)
}

console.log(format, format(c, t))

