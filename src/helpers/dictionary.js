const R = require('ramda')

module.exports = ({data, key, val})  => 
  R.reduce((acc, obj={}) =>
    R.assoc([obj[key]], obj[val], acc)
, {}, data || [])
