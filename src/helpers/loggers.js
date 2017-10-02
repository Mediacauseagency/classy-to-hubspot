const getDateTime = () => new Date().toUTCString()
const log = msg => console.log(`${getDateTime()} `, msg)
const errMsg = err => log(`❌  ${err}`)
const successMsg = success => log(`✅  ${success}`)

module.exports = {
  log,
  errMsg,
  successMsg,
}
