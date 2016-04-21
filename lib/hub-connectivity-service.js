'use strict'

const fdsh = require('./fdsh-client')

function hubConnectivityCheck(connectivityArgs, methodArgs) {
  return fdsh.createClient(connectivityArgs.host,
                           connectivityArgs.port,
                           connectivityArgs.path,
                           connectivityArgs.userId,
                           connectivityArgs.password,
                           'HubConnectivityService')
    .then(client => {
      return fdsh.invokeMethod(client,
                               connectivityArgs.cert,
                               connectivityArgs.key,
                               'HubConnectivityCheck',
                               {})
    })
}

exports.hubConnectivityCheck = hubConnectivityCheck
