'use strict'

const fdsh = require('./fdsh-client')
const SERVICE_NAME = 'VerifySSACompositeService'

function VerifySSA (connectivityArgs, methodArgs) {
  return fdsh.createClient(connectivityArgs.host,
                           connectivityArgs.port,
                           connectivityArgs.path,
                           connectivityArgs.userId,
                           connectivityArgs.password,
                           SERVICE_NAME,
                           { nc: 'http://niem.gov/niem/niem-core/2.0' })
    .then(client => {
      return fdsh.invokeMethod(client,
                               connectivityArgs.cert,
                               connectivityArgs.key,
                               'VerifySSA',
                               constructArgs())
    })

  function constructArgs() {
    let args = {
      "tns:SSACompositeIndividualRequest": {
        "tns:Person": {
          "tns:PersonSSNIdentification": methodArgs.ssn,
          "tns:PersonName": {
            "tns:PersonGivenName": methodArgs.firstName,
            "tns:PersonSurName": methodArgs.lastName
          },
          "nc:PersonBirthDate": { "nc:Date": methodArgs.dob }
        },
        "tns:RequestCitizenshipVerificationIndicator": "1",
        "tns:RequestIncarcerationVerificationIndicator": "1",
        "tns:RequestTitleIIMonthlyIncomeVerificationIndicator": "1",
        "tns:RequestTitleIIAnnualIncomeVerificationIndicator": "1",
        "tns:RequestQuartersOfCoverageVerificationIndicator": "1",
        "tns:RequestTitleIIMonthlyIncomeDate": "201512",
        "tns:RequestTitleIIAnnualIncomeDate": "2015"
      }
    }

    return args
  }
}

module.exports = { SERVICE_NAME, VerifySSA }
