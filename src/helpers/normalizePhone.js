const phoneFormatter = require('phone-formatter')

const normalizePhone = st => {
  if (!st) return ''
  const normal = phoneFormatter.normalize(st)
  if (!normal || !Number.isInteger(Number(normal))) return ''
  return phoneFormatter.format(normal, "(NNN) NNN-NNNN")
}

module.exports = normalizePhone
