const httpError = require('http-errors');
const signer = require('./signer');

function extractRawBody (req, res, buf) {
    req.rawBody = buf;
}

const defaults = {
    require: true,
    algorithm: 'sha1',
    header: 'X-Hub-Signature'
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

        const signature = req.header(config.header)

        if (config.require && !signature) {
            return next(httpError(400, `Missing ${config.header} header`));
        }
        else if (signature) {
            const body = Buffer.from(rawBody);

            if (signature !== sign(body)) {
                return next(httpError(400, `Invalid ${config.header}`));
            }
        }

        next();
    };
};

module.exports.extractRawBody = extractRawBody;
