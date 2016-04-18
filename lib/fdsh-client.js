'use strict';

let assert = require('assert');
let soap = require('soap');

/**
 * Instantiate a client.
 * @param {String} host The host name of the FDSH service
 * @param {Number} port The port number of the FDSH service
 * @param {String} path An optional URL component prior to the service name
 * @param {String} service Name of the FDSH service
 * @param {String} userId Your user ID for the FDSH
 * @param {String} password Your password for the FDSH
 * @param {Function} callback A function with signature (err, client)
 */
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

/**
 * Instantiate a client.
 * @param {Object} client A client object as instantiated by #createClient
 * @param {String} methodName Name of the SOAP method to invoke
 * @param {Object} args Arguments to pass to the method
 * @param {String} cert Your security certificate (must pre-share with FDSH)
 * @param {String} key The private key used by your security certificate
 * @param {Function} callback Function signature (err, result, raw, soapHeader)
 */
function invokeMethod(client, methodName, args, cert, key, callback) {
  try {
    assert(client, 'client parameter is required');
    assert(methodName, 'methodName parameter is required');
    assert(cert, 'cert parameter is required');
    assert(key, 'key parameter is required');
  } catch (err) {
    if (err) return callback(err);
  }

  var methodFunction = client[methodName];

  // ensure the SOAP service supports the specified method
  try {
    assert(methodFunction, `service has no method called "${methodName}"`);
  } catch(err) {
    return callback(err);
  }

  // invoke the service's method
  methodFunction(args, errorHandlingCallback, { cert, key })

  // provides some friendlier errors for common exceptions
  function errorHandlingCallback(err, result, raw, soapHeader) {
    if (err && err.message === 'undefined: undefined') {
      if (raw.indexOf('<l7:detailMessage id="7101">' >= 0))
        err.message = 'Your userId or password is probably incorrect.'
    }

    callback(err, result, raw, soapHeader);
  }
}

exports.createClient = createClient;
exports.invokeMethod = invokeMethod;
