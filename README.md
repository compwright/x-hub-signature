# X-Hub-Signature tools for Node.js

[![Build Status](https://app.travis-ci.com/compwright/x-hub-signature.svg?branch=master)](https://app.travis-ci.com/github/compwright/x-hub-signature)
[![Download Status](https://img.shields.io/npm/dm/x-hub-signature.svg?style=flat-square)](https://www.npmjs.com/package/x-hub-signature)
[![Sponsor on GitHub](https://img.shields.io/static/v1?label=Sponsor&message=❤&logo=GitHub&link=https://github.com/sponsors/compwright)](https://github.com/sponsors/compwright)

X-Hub-Signature is a compact way to validate webhooks from [Facebook](https://developers.facebook.com/docs/graph-api/webhooks/), [GitHub](https://developer.github.com/webhooks/securing/), or any other source that uses this signature scheme.

Requires Node.js 16+

## Getting Started

To install:

```shell
npm install x-hub-signature --save
```

## Usage

Sign a buffer containing a request body:

```javascript
import XHubSignature from 'x-hub-signature';
const x = new XHubSignature('sha1', 'my_little_secret');
const signature = x.sign(new Buffer('body-to-sign'));
// sha1=3dca279e731c97c38e3019a075dee9ebbd0a99f0
```

## XHubSignature

### constructor(algorithm, secret)

* `algorithm` (required) - `sha1` or other desired signing algorithm
* `secret` (required) - signing secret that the webhook was signed with

Creates an XHubSignature instance.

### sign(requestBody)

* `requestBody` (required) - a string or Buffer containing the body of the request to sign

Returns a string containing the value expected in the `X-Hub-Signature` header.

### verify(expectedSignature, requestBody)

* `expectedSignature` (required) - a string containing the `X-Hub-Signature` header value for an incoming request
* `requestBody` (required) - a string or Buffer containing the body of the incoming request

Returns `true` if the signature is valid, or false if it is invalid.

## License

MIT License
