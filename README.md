# fdsh-client [![NPM version][npm-image]][npm-url]

A Node.js client for the Federal Data Services Hub (FDSH)


## Install

Install with [npm](http://github.com/isaacs/npm):

```
npm install fdsh-client
```

## Synopsis

```javascript
const fdsh = require('fdsh-client');
const fs = require('fs');

// connectivity config
const host = 'dev.hub.cms.gov'
const port = 5443
const path = null
const userId = 'MY_USER_ID'
const password = 'MY_PASSWORD'
const cert = fs.readFileSync('/path/to/cert.pem'),
const key = fs.readFileSync('/path/to/key.pem'),
const connectivityArgs = { host, port, path, userId, password, cert, key }

// method-specific config
const firstName = 'MARK'
const middleName = ''
const lastName = 'WHITE'
const ssn = '277025100'
const dob = '1991-07-08'
const methodArgs = { firstName, middleName, lastName, ssn, dob }

let onThen = result => console.log(result)
let onCatch = err => console.error(err)
let service

fdsh.HubConnectivityService.hubConnectivityCheck(connectivityArgs)
  .then(onThen)
  .catch(onCatch)

fdsh.VerifySSACompositeService.verifySsa(connectivityArgs, methodArgs)
  .then(onThen)
  .catch(onCatch)
```

Output:
```javascript
{ ResponseMetadata: { ResponseCode: 'HS000000', ResponseDescriptionText: 'Success' } }

{ SSACompositeIndividualResponse:
  { ResponseMetadata: { ResponseCode: 'HS000000', ResponseDescriptionText: 'Success' },
    PersonSSNIdentification: '277025100',
    SSAResponse:
    { SSNVerificationIndicator: 'true',
      DeathConfirmationCode: 'Unconfirmed',
      PersonUSCitizenIndicator: 'true',
      PersonIncarcerationInformationIndicator: 'false',
      SSATitleIIMonthlyIncomeInformationIndicator: 'true',
      SSATitleIIAnnualIncomeInformationIndicator: 'false',
      SSATitleIIMonthlyIncome: [Object] } } }
```

## FAQ

__What is the Federal Data Services Hub (FDSH)?__

It's a system developed for the sharing of information between various entities.

__Who oversees the FDSH?__

[The Centers for Medicare & Medicaid Services (CMS)](https://www.cms.gov/)

__Who built the FDSH?__

[QSS, Inc. (QSSI)](http://www.qssinc.com/)

__How can I obtain a user ID, password, etc.?__

You must speak with CMS.

## TODO
* tests

## Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.


[npm-url]: https://npmjs.org/package/fdsh-client
[npm-image]: http://img.shields.io/npm/v/fdsh-client.svg
