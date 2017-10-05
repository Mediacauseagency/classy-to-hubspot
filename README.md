# Classy to HubSpot

[![CircleCI](https://circleci.com/gh/Mediacauseagency/classy-to-hubspot.svg?style=svg)](https://circleci.com/gh/Mediacauseagency/classy-to-hubspot)

### Overview
Gets all transaction data from Classy for a specific org and formats it and sends it to HubSpot.

### Getting started
1. Make sure node is installed.
2. Run `npm run setup`. This will install all of the node packages and create an empty `history` directory.
3. Get the API keys from a fellow dev and add them to a `.env` file in the project's root directory.
4. Run `npm run start` (or `node src/index.js`).

### Running tests
`npm run test` will do the following: 
- do a dependency check
- lint your code based on [standard JS](https://standardjs.com/) and make fixes where possible
- run tests in `test/index.js`

#### *Make sure that `npm run test` passes before commiting.*
