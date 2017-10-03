const iso = require('./iso')
const log = msg => console.log(`${iso()} `, msg)
const errMsg = msg => log(`❌  ${msg}`)
const successMsg = msg => log(`✅  ${msg}`)
const writeMsg = msg => log(`✏️  ${msg}`)

module.exports = {
  log,
  errMsg,
  successMsg,
  writeMsg,
}
