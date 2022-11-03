# X-Hub-Signature tools for Node.js

[![Build Status](https://travis-ci.com/compwright/x-hub-signature.svg?branch=master)](https://travis-ci.com/compwright/x-hub-signature)
[![Download Status](https://img.shields.io/npm/dm/x-hub-signature.svg?style=flat-square)](https://www.npmjs.com/package/x-hub-signature)
[![Sponsor on GitHub](https://img.shields.io/static/v1?label=Sponsor&message=❤&logo=GitHub&link=https://github.com/sponsors/compwright)](https://github.com/sponsors/compwright)

X-Hub-Signature is a compact way to validate real-time updates, such as webhooks from [Facebook](https://developers.facebook.com/docs/graph-api/webhooks/) and [GitHub](https://developer.github.com/webhooks/securing/).

Requires Node.js 10+

## Getting Started

To install:

```shell
npm install x-hub-signature --save
```

## Signature API

Use the bundled signature generator to sign a request body buffer.

```javascript
const signer = require('x-hub-signature');
const sign = signer({ algorithm: 'sha1', secret: 'my_little_secret' });
const signature = sign(new Buffer('random-signature-body'));
// sha1=3dca279e731c97c38e3019a075dee9ebbd0a99f0
```

**Options:**

* `algorithm` (required) - `sha1` or other desired signing algorithm
* `secret` (required) - signing secret that the webhook was signed with

## License

MIT License

## Acknowledgements

This project was based on [express-x-hub](https://github.com/alexcurtis/express-x-hub) by Alex Curtis.
