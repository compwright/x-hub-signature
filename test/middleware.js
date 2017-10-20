const middleware = require('../src/middleware');
const Readable = require('stream').Readable;

function mockRequest(signature, body) {
    const req = new Readable();

    req.headers = {};

    if (signature) {
        req.headers['X-Hub-Signature'] = signature;
    }

    req.header = function(name) {
        return this.headers[name];
    };

    req._read = function() {
        this.push(body);
        this.push(null);
    };

    return req;
}

describe('x-hub-signature.middleware', function() {

    it('should pass when the request signature is valid', function(done) {
        const body = '{ "id": "realtime_update" }';
        const signature = 'sha1=c1a072c0aca15c6bd2f5bfae288ff8420e74aa5e';
        const req = mockRequest(signature, body);
        const middle = middleware({
            algorithm: 'sha1',
            secret: 'my_little_secret'
        });
        middle(req, null, function(err) {
            global.should.not.exist(err);
            done();
        });
    });

    it('should pass when the request signature is missing and not required', function(done) {
        const body = '{ "id": "realtime_update" }';
        const signature = undefined;
        const req = mockRequest(signature, body);
        const middle = middleware({
            algorithm: 'sha1',
            secret: 'my_little_secret',
            require: false
        });
        middle(req, null, function(err) {
            global.should.not.exist(err);
            done();
        });
    });

    it('should return HTTP 400 when the request signature is missing and required', function(done) {
        const body = '{ "id": "realtime_update" }';
        const signature = undefined;
        const req = mockRequest(signature, body);
        const middle = middleware({
            algorithm: 'sha1',
            secret: 'my_little_secret'
        });
        middle(req, null, function(err) {
            global.should.exist(err);
            err.status.should.equal(400);
            done();
        });
    });

    it('should return HTTP 400 when the request signature is invalid', function(done) {
        const body = '{ "id": "realtime_update" }';
        const signature = 'sha1=invalid_req_signature';
        const req = mockRequest(signature, body);
        const middle = middleware({
            algorithm: 'sha1',
            secret: 'my_little_secret',
            required: false
        });
        middle(req, null, function(err) {
            global.should.exist(err);
            err.status.should.equal(400);
            done();
        });
    });

});