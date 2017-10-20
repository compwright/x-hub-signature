const readStream = require('read-all-stream');
const httpError = require('http-errors');
const signer = require('./signer');

const defaults = {
    require: true,
    algorithm: 'sha1'
};

module.exports = function (options) {
    const config = Object.assign({}, defaults, options);
    const sign = signer(config);
    
    return function (req, res, next) {
        const signature = req.header('X-Hub-Signature');

        if (config.require && !signature) {
            next(httpError(400, 'Missing X-Hub-Signature header'));
        }
        else if (signature) {
            readStream(req, 'utf8', (err, data) => {
                if (err) {
                    return next(err);
                }
                else if (signature !== sign(new Buffer(data))) {
                    next(httpError(400, 'Invalid X-Hub-Signature'));
                }
                else {
                    next();
                }
            });
        }
        else {
            next();
        }
    };
};
