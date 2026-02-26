'use strict';

const crypto = require('crypto');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const crypto__default = /*#__PURE__*/_interopDefaultCompat(crypto);

class XHubSignature {
  #algorithm = null;
  #secret = null;
  #encoder = null;
  constructor(algorithm, secret) {
    if (!algorithm) {
      throw new Error("Algorithm is required");
    }
    if (!secret) {
      throw new Error("Secret is required");
    }
    this.#algorithm = algorithm;
    this.#secret = secret;
    this.#encoder = new TextEncoder();
  }
  sign(requestBody) {
    const hmac = crypto__default.createHmac(this.#algorithm, this.#secret);
    hmac.update(requestBody, "utf-8");
    return this.#algorithm + "=" + hmac.digest("hex");
  }
  verify(expectedSignature, requestBody) {
    const expected = this.#encoder.encode(expectedSignature);
    const actual = this.#encoder.encode(this.sign(requestBody));
    if (expected.length !== actual.length) {
      return false;
    }
    return crypto__default.timingSafeEqual(expected, actual);
  }
}

module.exports = XHubSignature;
