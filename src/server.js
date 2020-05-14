const cero = require('0http')
const router = require('./router')
const { server } = cero({ router })

module.exports = server