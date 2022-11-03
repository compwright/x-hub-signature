'use strict';

const crypto = require('crypto');

var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _algorithm, _secret;
class XHubSignature {
  constructor(algorithm, secret) {
    __privateAdd(this, _algorithm, null);
    __privateAdd(this, _secret, null);
    if (!algorithm) {
      throw new Error("Algorithm is required");
    }
    if (!secret) {
      throw new Error("Secret is required");
    }
    __privateSet(this, _algorithm, algorithm);
    __privateSet(this, _secret, secret);
  }
  sign(requestBody) {
    const hmac = crypto.createHmac(__privateGet(this, _algorithm), __privateGet(this, _secret));
    hmac.update(requestBody, "utf-8");
    return __privateGet(this, _algorithm) + "=" + hmac.digest("hex");
  }
  verify(expectedSignature, requestBody) {
    return expectedSignature === this.sign(requestBody);
  }
}
_algorithm = new WeakMap();
_secret = new WeakMap();

module.exports = XHubSignature;
