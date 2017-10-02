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


## Todo: 
- rename classy to getClassy
- rename formatData to formatClassyData
- add tests for formatData (use tmp data)
- double check all of the field names
- format to Classy data to csv and send csv to client
- setup HubSpot integration





