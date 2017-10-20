# X-Hub-Signature tools for Node.js and Express

[![Build Status](https://travis-ci.org/compwright/x-hub-signature.svg?branch=master)](https://travis-ci.org/compwright/x-hub-signature)

X-Hub-Signature is a compact way to validate real-time updates, such as webhooks from [Facebook](https://developers.facebook.com/docs/graph-api/webhooks/) and [GitHub](https://developer.github.com/webhooks/securing/).

Requires Node.js 6.4+

## Getting Started

To install:

```shell
npm install x-hub-signature --save
```

## Express Middleware

To validate incoming webhooks signed with `X-Hub-Signature`, use the bundled Express middleware.

> Note: It needs to registered before body-parser.

```javascript
const webhookMiddleware = require('x-hub-signature').middleware;
app.use(webhookMiddleware({ algorithm: 'sha1', secret: 'secret', require: true }));
app.use(bodyParser());
```

**Options:**

* `algorithm` (required) - `sha1` or other desired signing algorithm
* `secret` (required) - signing secret that the webhook was signed with
* `require` (optional) - boolean, whether to require the presence of the `X-Hub-Signature` header. If true, throws an HTTP 400 error if the header is not present. If false, the middleware will pass the request on if the header is not present, and validate the header only if it is present. (default: `true`)

## Signature API

Use the bundled signature generator to sign a request body buffer.

```javascript
const { signer } = require('x-hub-signature');
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
