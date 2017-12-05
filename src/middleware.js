const bodyParser = require('body-parser');
const httpError = require('http-errors');
const signer = require('./signer');

function extractRawBody (req, res, buf) {
    req.rawBody = buf;
}

const defaults = {
    require: true,
    algorithm: 'sha1',
    bodyParser: bodyParser.text,
    bodyParserOptions: {}
};

module.exports = function (options) {
    const config = Object.assign({}, defaults, options);
    config.bodyParserOptions.verify = extractRawBody;
    
    const sign = signer(config);

    return [
        config.bodyParser(config.bodyParserOptions),

        function (req, res, next) {
            const signature = req.header('X-Hub-Signature');
    
            if (config.require && !signature) {
                return next(httpError(400, 'Missing X-Hub-Signature header'));
            }
            else if (signature) {
                const body = new Buffer(req.rawBody);
    
                if (signature !== sign(body)) {
                    return next(httpError(400, 'Invalid X-Hub-Signature'));
                }
            }
    
            next();
        }
    ];
};
