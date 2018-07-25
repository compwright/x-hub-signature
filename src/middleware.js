const httpError = require('http-errors');
const signer = require('./signer');

function extractRawBody (req, res, buf) {
    req.rawBody = buf;
}

const defaults = {
    require: true,
    algorithm: 'sha1',
    getRawBody: req => req.rawBody
};

module.exports = function (options) {
    const config = Object.assign({}, defaults, options);
    const sign = signer(config);

    if (typeof config.getRawBody !== 'function') {
        throw new Error('x-hub-signature middleware: "getRawBody" must be a function');
    }

    return function (req, res, next) {
        const rawBody = config.getRawBody(req);
        if (!rawBody) {
            return next(httpError(500, 'Missing req.rawBody, see the x-hub-signature readme'));
        }

        const signature = req.header('X-Hub-Signature');

        if (config.require && !signature) {
            return next(httpError(400, 'Missing X-Hub-Signature header'));
        }
        else if (signature) {
            const body = Buffer.from(rawBody);

            if (signature !== sign(body)) {
                return next(httpError(400, 'Invalid X-Hub-Signature'));
            }
        }

        next();
    };
};

module.exports.extractRawBody = extractRawBody;
