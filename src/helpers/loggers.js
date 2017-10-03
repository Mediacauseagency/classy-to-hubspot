const getDateTime = () => new Date().toISOString()
const log = msg => console.log(`${getDateTime()} `, msg)
const errMsg = msg => log(`❌  ${msg}`)
const successMsg = msg => log(`✅  ${msg}`)
const writeMsg = msg => log(`✏️  ${msg}`)

module.exports = {
  log,
  errMsg,
  successMsg,
  writeMsg,
}
