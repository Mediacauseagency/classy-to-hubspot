const concatJson = require('./concatJson')
const iso = require('./iso')

module.exports = (key) => (jsonArray, value) =>  {
  const obj = {
    dateTime : iso(),
    [key] : value
  }
  return concatJson(jsonArray, obj)
}
