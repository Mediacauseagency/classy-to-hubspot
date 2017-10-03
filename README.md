# Classy to HubSpot

[![CircleCI](https://circleci.com/gh/Mediacauseagency/classy-to-hubspot.svg?style=svg)](https://circleci.com/gh/Mediacauseagency/classy-to-hubspot)

A `node` intermediary between the Classy and HubSpot APIs.

### Overview
This node project will run a cron job every 30 minutes to get the transaction data from Classy for a specific org and send it to HubSpot. The first time it runs, it will get all of the transaction data. For the following times, it will filter the query for transactions that have been updated in the last 35 minutes (the 5 minute buffer is to account for the time that the job is running).

### Getting started
1. Make sure node is installed.
2. Run `npm run setup`. This will install all of the node packages and create an empty `history` directory.
3. Get the API keys from and add them to a `.env` file in the project's root directory.
4. Run `npm run start`.

### Running tests
`npm run test` will do the following: 
- do a dependency check
- lint your code based on [standard JS](https://standardjs.com/) and make fixes where possible
- run tests in `test/index.js`

#### *Make sure that `npm run test` passes before commiting.*
