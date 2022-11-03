const crypto = require('crypto');
const assert = require('assert');

module.exports = ({ algorithm, secret }) => (buffer) => {
  assert(secret, 'Secret is required');
  assert(algorithm, 'Algorithm is required');

  const hmac = crypto.createHmac(algorithm, secret);
  hmac.update(buffer, 'utf-8');
  return algorithm + '=' + hmac.digest('hex');
};
