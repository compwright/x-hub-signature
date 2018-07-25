const bodyParser = require('body-parser');
const middleware = require('../src/middleware');

const Readable = require('stream').Readable;

function mockRequest(signature, body, type) {
    const req = new Readable();

    req.headers = {
        'content-length': body.length,
        'content-type': type
    };

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


describe('body-parser compatibility', function() {

    it('should work with bodyParser.json() and the "extractRawBody" verifier', function(done) {
        const body = '{ "id": "realtime_update" }';
        const signature = 'sha1=c1a072c0aca15c6bd2f5bfae288ff8420e74aa5e';
        const req = mockRequest(signature, body, 'application/json');
        
        const parser = bodyParser.json({
            verify: middleware.extractRawBody
        });
        
        const middle = middleware({
            algorithm: 'sha1',
            secret: 'my_little_secret'
        });
        
        parser(req, null, function(err) {
            global.should.not.exist(err);
            middle(req, null, function(err) {
                global.should.not.exist(err);
                done();
            });
        });
    });

});