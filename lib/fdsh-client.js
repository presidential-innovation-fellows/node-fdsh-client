'use strict';

function createClient() {
  console.log('createClient');
}

function invokeMethod(client, methodName) {
  console.log('invokeMethod');
}

exports.createClient = createClient;
exports.invokeMethod = invokeMethod;
