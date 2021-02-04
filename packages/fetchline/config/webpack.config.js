const path = require('path')
const cloneDeep = require('lodash/clonedeep')
const baseconfig = cloneDeep(require('../../../baseconfig/webpack.config.js'))
baseconfig.output.path = path.resolve(__dirname, '../dist/umd')
module.exports = baseconfig
