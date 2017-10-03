const R = require('ramda')

module.exports = (jsonArray, obj={}) =>  {
  const arr = JSON.parse(jsonArray || "[]")
  return JSON.stringify(R.concat(arr, [obj]))
}
