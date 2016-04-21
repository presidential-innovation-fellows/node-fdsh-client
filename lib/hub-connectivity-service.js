'use strict'

const fdsh = require('./fdsh-client')
const SERVICE_NAME = 'HubConnectivityService'

function HubConnectivityCheck(connectivityArgs, methodArgs) {
  return fdsh.createClient(connectivityArgs.host,
                           connectivityArgs.port,
                           connectivityArgs.path,
                           connectivityArgs.userId,
                           connectivityArgs.password,
                           SERVICE_NAME)
    .then(client => {
      return fdsh.invokeMethod(client,
                               connectivityArgs.cert,
                               connectivityArgs.key,
                               'HubConnectivityCheck',
                               {})
    })
}

module.exports = { SERVICE_NAME, HubConnectivityCheck }
