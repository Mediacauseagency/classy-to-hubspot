# Classy to HubSpot

[![CircleCI](https://circleci.com/gh/Mediacauseagency/classy-to-hubspot.svg?style=svg)](https://circleci.com/gh/Mediacauseagency/classy-to-hubspot)

A `node` intermediary between the Classy and HubSpot APIs.

### Getting started
1. Install the packages: `npm install`.
2. Get the API keys and add them to a `.env` file in the project's root directory.

### Running tests
`npm run test` will do the following: 
- do a dependency check
- lint your code based on [standard JS](https://standardjs.com/) and make fixes where possible
- run tests in `test/index.js`

#### *Make sure that `npm run test` passes before commiting.*


Sample response for supporter: 

```js
{
  first_name: 'Stan',
  last_name: 'Smith',
  updated_at: null,
  metadata: null,
  id: 1234567,
  email_address: 'stan@smith.org',
  phone: '123-234-5678',
  location: null,
  address1: '123 Tennis Court',
  address2: 'Apt. B',
  city: 'Boston',
  state: 'MA',
  country: 'US',
  postal_code: '12345',
  gender: null,
  member_id: 987654,
  source_member_id: null,
  source_organization_id: 12345,
  source_campaign_id: null,
  source_fundraising_page_id: null,
  opt_in: false,
  created_at: '2016-03-24T00:00:00+0000',
  last_emailed_at: null 
}
```
