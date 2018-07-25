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

> Note: Do not use body-parser directly with this middleware. If you need a specific body-parser configuration, you can pass in the method and configuration as options (see below).

```javascript
const bodyParser = require('body-parser');
const webhookMiddleware = require('x-hub-signature').middleware;
app.use(webhookMiddleware({
  algorithm: 'sha1',
  secret: 'secret',
  require: true,
  bodyParser: bodyParser.json, // DO NOT INVOKE HERE! e.g. bodyParser.json()
  bodyParserOptions: {}
}));
```

**Options:**

* `algorithm` (required) - `sha1` or other desired signing algorithm
* `secret` (required) - signing secret that the webhook was signed with
* `require` (optional) - boolean, whether to require the presence of the `X-Hub-Signature` header. If true, throws an HTTP 400 error if the header is not present. If false, the middleware will pass the request on if the header is not present, and validate the header only if it is present. (default: `true`)
* `getRawBody` - function that accepts `req` as the first argument and returns the raw body. If you use the bundled body-parser verifier (see below), you don't need to set this option.

### Use with body-parser

A very common case is to have [body-parser](https://github.com/expressjs/body-parser) middleware globally defined. This produces complications for the x-hub-signature middleware, since it needs a copy of the raw unparsed body, and `body-parser` by default does not save this on the request.

In this case, you can use the bundled `middleware.extractRawBody` verifier function with body-parser. This will set a reference to the buffered raw (unparsed) body to `req.rawBody`:

```javascript
const bodyParser = require('body-parser');
const webhookMiddleware = require('x-hub-signature').middleware;
app.use(bodyParser.json({
  verify: webhookMiddleware.extractRawBody
}))
app.use(webhookMiddleware({
  algorithm: 'sha1',
  secret: 'secret',
  require: true
}));
```

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
