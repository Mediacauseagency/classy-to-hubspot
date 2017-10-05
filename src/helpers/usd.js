const formatCurrency = require('currency-formatter').format

module.exports = amount => formatCurrency(amount, {code: 'USD'})
