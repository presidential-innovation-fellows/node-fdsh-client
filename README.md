# fdsh-client [![NPM version][npm-image]][npm-url]

A Node.js client for the Federal Data Services Hub (FDSH)


## Install

Install with [npm](http://github.com/isaacs/npm):

```
npm install fdsh-client
```

### Synopsis

```javascript
const fdsh = require('fdsh-client');
const fs = require('fs');

fdsh.createClient('dev.hub.cms.gov',
                  9443,
                  '/impl',
                  'HubConnectivityService',
                  'MY.USER.ID.001.001',
                  'abc123',
                  function(err, client) {
  if (err) throw err;
  fdsh.invokeMethod(client,
                    'HubConnectivityCheck',
                    { foo: 'bar' },
                    fs.readFileSync('/path/to/cert.pem'),
                    fs.readFileSync('/path/to/key.pem'),
                    function(err, result, raw, soapHeader) {
    if (err) throw err;
    console.log(result);
  });
});
```

Output:
```JSON
{
  "ResponseMetadata":
  {
    "ResponseCode": "HS000000",
    "ResponseDescriptionText": "Success"
  }
}
```

### FAQ

__What is the Federal Data Services Hub (FDSH)?__

It's a system developed for the sharing of information between various entities.

__Who oversees the FDSH?__

[The Centers for Medicare & Medicaid Services (CMS)](https://www.cms.gov/)

__Who built the FDSH?__

[QSS, Inc. (QSSI)](http://www.qssinc.com/)

__How can I obtain a user ID, password, etc.?__

You must speak with CMS.

### TODO
* tests

### Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.


[npm-url]: https://npmjs.org/package/fdsh-client
[npm-image]: http://img.shields.io/npm/v/fdsh-client.svg
