const _ = require('lodash');
const config = require('./backend-config');
const seviceConfiguration = require('./service-configuration');
module.exports = _.assign(config, seviceConfiguration);
