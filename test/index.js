const test = require('tape')
const dictionary = require('../src/helpers/dictionary')

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
