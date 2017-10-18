# Classy to HubSpot

[![CircleCI](https://circleci.com/gh/Mediacauseagency/classy-to-hubspot.svg?style=svg)](https://circleci.com/gh/Mediacauseagency/classy-to-hubspot)

### Overview
Gets all transaction data from Classy for a specific org and formats it and sends it to HubSpot.

### Getting started
1. Make sure that an up-to-date version of node and NPM are installed.
2. Run `npm run setup`. This will install all of the node packages and create an empty `history` directory.
3. Get the API keys from a fellow dev and add them to a `.env` file in the project's root directory.
4. Run `npm run start` from inside of this directory, or `node ./path-to-this-directory/src/index.js` from outside of this directory.

### Running tests
`npm run test` will do the following: 
- do a dependency check
- lint your code based on [standard JS](https://standardjs.com/) and make fixes where possible
- run tests in `test/index.js`

### NPM packages
- `ramda` is used heavily as the standard library.
- `request` is used for handling HTTP requests.
- `moment` is used for manipulating date/time.

### Debugging
All API errors will get written to json files in the `history` directory.

#### *Make sure that `npm run test` passes before commiting.*
