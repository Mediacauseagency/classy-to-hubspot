// first, get various API keys and info from .env and assign them to the process.env
require('dotenv').config()
const getClassyData = require('./classy/getData')
const formatClassyData = require('./classy/formatData')

getClassyData(formatClassyData)
