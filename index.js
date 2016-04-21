'use strict';

module.exports = require('./lib/fdsh-client');

const serviceModules = [
  'hub-connectivity-service',
  'verify-ssa-composite-service'
]

for (let path of serviceModules) {
  let service = require('./lib/' + path)
  module.exports[service.SERVICE_NAME] = service
}
