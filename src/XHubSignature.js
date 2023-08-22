import crypto from 'crypto'

let encoder = new TextEncoder()

export default class XHubSignature {
  #algorithm = null
  #secret = null

  constructor (algorithm, secret) {
    if (!algorithm) {
      throw new Error('Algorithm is required')
    }

    if (!secret) {
      throw new Error('Secret is required')
    }

    this.#algorithm = algorithm
    this.#secret = secret
  }

  sign (requestBody) {
    const hmac = crypto.createHmac(this.#algorithm, this.#secret)
    hmac.update(requestBody, 'utf-8')
    return this.#algorithm + '=' + hmac.digest('hex')
  }

  verify (expectedSignature, requestBody) {
    const expected = encoder.encode(expectedSignature)
    const actualSignature = this.sign(requestBody)
    const actual = encoder.encode(signature)
    if (expected.length !== actual.length) {
      return false
    }
    return crypto.timingSafeEqual(expected, actual)
  }
}
