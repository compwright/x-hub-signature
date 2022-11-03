import XHubSignature from './XHubSignature'

describe('XHubSignature', () => {
  describe('constructor(algorithm, secret)', () => {
    it('should throw when algorithm is not specified', () => {
      expect(() => new XHubSignature('', 'asdf')).toThrow(Error)
    })

    it('should throw when secret is empty', () => {
      expect(() => new XHubSignature('sha1', '')).toThrow(Error)
    })
  })

  describe('sign(requestBody)', () => {
    it('should sign using the specified parameters', () => {
      const expected = 'sha1=3dca279e731c97c38e3019a075dee9ebbd0a99f0'
      const secret = 'my_little_secret'
      const algorithm = 'sha1'
      const body = Buffer.from('random-signature-body')
      const x = new XHubSignature(algorithm, secret)
      const signature = x.sign(body)
      expect(signature).toBe(expected)
      expect(signature).toMatch(algorithm)
    })

    it('should sign UTF-8 bodies with the specified parameters', () => {
      const expected = 'sha1=6eca52592dced2ec4b9c974538d6bb32e25ab897'
      const secret = 'my_little_secret'
      const algorithm = 'sha1'
      const body = Buffer.from('random-utf-8-あいうえお-body')
      const x = new XHubSignature(algorithm, secret)
      const signature = x.sign(body)
      expect(signature).toBe(expected)
    })

    it('should sign UTF-8 bodies with sha256', () => {
      const expected = 'sha256=2bee603b1bd2b873912ee43469a3b4a377ad70e7f64cbd58ccdbc67eb9a1b37f'
      const secret = 'my_little_secret'
      const algorithm = 'sha256'
      const body = Buffer.from('{ "id": "realtime_update" }')
      const x = new XHubSignature(algorithm, secret)
      const signature = x.sign(body)
      expect(signature).toBe(expected)
    })
  })

  describe('verify(expectedSignature, requestBody)', () => {
    it('should return true when valid', () => {
      const expected = 'sha1=3dca279e731c97c38e3019a075dee9ebbd0a99f0'
      const body = Buffer.from('random-signature-body')
      const x = new XHubSignature('sha1', 'my_little_secret')
      const isValid = x.verify(expected, body)
      expect(isValid).toBe(true)
    })

    it('should return true when valid and the body contains UTF-8 characters', () => {
      const expected = 'sha1=6eca52592dced2ec4b9c974538d6bb32e25ab897'
      const body = Buffer.from('random-utf-8-あいうえお-body')
      const x = new XHubSignature('sha1', 'my_little_secret')
      const isValid = x.verify(expected, body)
      expect(isValid).toBe(true)
    })

    it('should return true when valid and the body contains UTF-8 characters (SHA-256)', () => {
      const expected = 'sha256=2bee603b1bd2b873912ee43469a3b4a377ad70e7f64cbd58ccdbc67eb9a1b37f'
      const body = Buffer.from('{ "id": "realtime_update" }')
      const x = new XHubSignature('sha256', 'my_little_secret')
      const isValid = x.verify(expected, body)
      expect(isValid).toBe(true)
    })

    it('should return false when the signature is empty', () => {
      const body = Buffer.from('random-signature-body')
      const x = new XHubSignature('sha1', 'my_little_secret')
      const isValid = x.verify('', body)
      expect(isValid).toBe(false)
    })

    it('should return false when the signature is invalid', () => {
      const body = Buffer.from('random-signature-body')
      const x = new XHubSignature('sha1', 'my_little_secret')
      const isValid = x.verify('foobar', body)
      expect(isValid).toBe(false)
    })

    it('should return false when the signature algorithm does not match', () => {
      const expected = 'sha256=2bee603b1bd2b873912ee43469a3b4a377ad70e7f64cbd58ccdbc67eb9a1b37f'
      const body = Buffer.from('{ "id": "realtime_update" }')
      const x = new XHubSignature('sha1', 'my_little_secret')
      const isValid = x.verify(expected, body)
      expect(isValid).toBe(false)
    })
  })
})
