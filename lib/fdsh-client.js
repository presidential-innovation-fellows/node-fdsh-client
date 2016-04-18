'use strict';

let soap = require('soap');

// callback(err, client)
function createClient(host, port, path, service, userId, password, callback) {
  path = (path || '').replace(/^\/*(.*?)\/*$/, '$1');
  if (path) path += '/';

  let url = 'https://' + host + ':' + port + '/' + path + service + '?wsdl';
  soap.createClient(url, { forceSoap12Headers: true }, createClientCallback);

  function createClientCallback (err, client) {
    if (err) return callback(err);

    // configure security
    let wss = new soap.WSSecurity(userId, password, 'PasswordDigest');
    client.setSecurity(wss);

    callback(null, client);
  }
}

function invokeMethod(client, methodName) {
  console.log('invokeMethod');
}

exports.createClient = createClient;
exports.invokeMethod = invokeMethod;
