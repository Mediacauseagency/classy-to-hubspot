const test = require('tape')
const dictionary = require('../src/helpers/dictionary')
const addStringNumbers = require('../src/helpers/addStringNumbers')
const usd = require('../src/helpers/usd')
const normalizePhone = require('../src/helpers/normalizePhone')

test('dictionary', t => {
  const data = [
    {id: 45, name: 'zenobia'},
    {id: 89, name: 'frank'},
    {id: 3, name: 'shelly'}
  ]
  const dict = dictionary({data, key: 'id', val: 'name'})
  const expected = {
    45: 'zenobia',
    89: 'frank',
    3: 'shelly'
  }
  t.same(dict, expected)
  t.end()
})

test('addStringNumbers', t => {
  t.equal(addStringNumbers('2.34', 4.5), 6.84)
  t.equal(addStringNumbers('2.34', '4.5'), 6.84)
  t.equal(addStringNumbers('5.30', undefined), 5.3)
  t.equal(addStringNumbers(undefined, '5.30'), 5.3)
  t.end()
})

test('usd', t => {
  t.equal(usd('50000'), '$50,000.00')
  t.equal(usd(50000), '$50,000.00')
  t.equal(usd(50000.3), '$50,000.30')
  t.equal(usd('50000.34'), '$50,000.34')
  t.end()
})

test('normalizePhone', t => {
  t.equal(normalizePhone('4159405012'), '(415) 940-5012')
  t.equal(normalizePhone('415.940.5012'), '(415) 940-5012')
  t.equal(normalizePhone('1 + (415)-940-5012'), '(415) 940-5012')
  t.equal(normalizePhone(''), '')
  t.equal(normalizePhone(null), '')
  t.equal(normalizePhone('apple'), '')
  t.end()
})
