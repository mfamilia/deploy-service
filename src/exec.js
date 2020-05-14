const util = require('util')
const child = require('child_process')

module.exports = util.promisify(child.exec);
