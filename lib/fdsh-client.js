'use strict';

let assert = require('assert');
let soap = require('soap');

// callback(err, client)
function createClient(host, port, path, service, userId, password, callback) {
  try {
    assert(host, 'host parameter is required');
    assert(port, 'port parameter is required');
    assert(service, 'service parameter is required');
    assert(userId, 'userId parameter is required');
    assert(password, 'password parameter is required');
  } catch (err) {
    if (err) return callback(err);
  }

  // ensure proper slashing
  path = (path || '').replace(/^\/*(.*?)\/*$/, '$1');
  if (path) path += '/';

  let url = `https://${host}:${port}/${path}${service}?wsdl`;
  soap.createClient(url, { forceSoap12Headers: true }, createClientCallback);

  function createClientCallback (err, client) {
    if (err) return callback(err);

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
