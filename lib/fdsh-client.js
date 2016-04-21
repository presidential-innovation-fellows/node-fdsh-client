'use strict'

const assert = require('assert')
const soap = require('soap')

/**
 * Instantiate a client.
 * @param {string} host The host name of the FDSH service.
 * @param {number} port The port number of the FDSH service.
 * @param {string} path An optional URL component prior to the service name.
 * @param {string} service Name of the FDSH service.
 * @param {string} userId Your user ID for the FDSH.
 * @param {string} password Your password for the FDSH.
 * @return {Promise<object>} A promise that resolves with a client object.
 */
function createClient(host, port, path, service, userId, password,
                      additionalNamespaces) {
  return new Promise((resolve, reject) => {
    try {
      assert(host, 'host parameter is required')
      assert(port, 'port parameter is required')
      assert(service, 'service parameter is required')
      assert(userId, 'userId parameter is required')
      assert(password, 'password parameter is required')

      // ensure proper slashing
      path = (path || '').replace(/^\/*(.*?)\/*$/, '$1')
      if (path) path += '/'

      let url = `https://${host}:${port}/${path}${service}?wsdl`
      let options = { forceSoap12Headers: true }

      soap.createClient(url, options, (err, client) => {
        if (err) {
          reject(err)
        } else {
          // hack to allow additional namespaces to be defined on the request
          // envelope, as they don't always appear to be automatically set
          // correctly from the WSDL alone
          for (let key in additionalNamespaces) {
            client.wsdl.definitions.xmlns[key] = additionalNamespaces[key]
          }
          client.wsdl.xmlnsInEnvelope = client.wsdl._xmlnsMap()

          let wss = new soap.WSSecurity(userId, password, 'PasswordDigest')
          client.setSecurity(wss)

          resolve(client)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Invoke a method against a client.
 * @param {object} client A client object as resolved by #createClient.
 * @param {string} methodName Name of the SOAP method to invoke.
 * @param {object} args Arguments to pass to the method.
 * @param {string} cert Your security certificate (must pre-share with FDSH).
 * @param {string} key The private key used by your security certificate.
 * @return {Promise<result>} A promise that resolves with a result object.
 */
function invokeMethod(client, methodName, args, cert, key) {
  return new Promise((resolve, reject) => {
    try {
      assert(client, 'client parameter is required')
      assert(methodName, 'methodName parameter is required')
      assert(cert, 'cert parameter is required')
      assert(key, 'key parameter is required')

      let methodFunction = client[methodName]
      assert(methodFunction, `service has no method called "${methodName}"`)
      methodFunction(args, callback, { cert, key })
    } catch (err) {
      reject(err)
    }

    function callback(err, result, raw, soapHeader) {
      if (err) {
        reject(_translateErr(err, result, raw, soapHeader))
      } else {
        resolve(result)
      }
    }
  })
}

/**
 * Provides friendlier error messages in common situations.
 * @param {object} err As returned by the SOAP method invocation.
 * @param {object} result As returned by the SOAP method invocation.
 * @param {object} raw As returned by the SOAP method invocation.
 * @param {object} soapHeader As returned by the SOAP method invocation.
 * @return {object} The same error object passed as an input argument.
 */
function _translateErr(err, result, raw, soapHeader) {
  if (err.message === 'undefined: undefined') {
    if (raw.indexOf('<l7:detailMessage id="7101">' >= 0))
      err.message = 'Your userId or password is probably incorrect.'
  }

  return err
}

exports.createClient = createClient
exports.invokeMethod = invokeMethod
