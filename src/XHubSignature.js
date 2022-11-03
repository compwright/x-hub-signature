import crypto from 'crypto'

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

  sign (buffer) {
    const hmac = crypto.createHmac(this.#algorithm, this.#secret)
    hmac.update(buffer, 'utf-8')
    return this.#algorithm + '=' + hmac.digest('hex')
  }
}
