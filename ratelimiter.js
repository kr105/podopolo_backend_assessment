const { RateLimiterMemory } = require("rate-limiter-flexible");

const opts = {
    points: 100,  // requests every
    duration: 10, // seconds
};
const rateLimiter = new RateLimiterMemory(opts);

const rateLimiterMiddleware = (req, res, next) => {
    rateLimiter.consume(req.ip)
        .then(() => {
            next();
        })
        .catch(() => {
            res.status(429);
            res.contentType('application/problem+json'); // RFC7807
            res.json({ message: 'Too Many Requests' });
            res.send();
        });
};

module.exports = rateLimiterMiddleware;