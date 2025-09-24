const defaultWindowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3000', 10);
const map = new Map();

module.exports = function rateLimit(options = {}) {
  const windowMs = options.windowMs ?? defaultWindowMs;

  return function (req, res, next) {
    const deviceId = req.cookies?.[process.env.KEY_COOKIE_NAME] || req.ip;
    const now = Date.now();
    const last = map.get(deviceId) || 0;

    if (now - last < windowMs) {
      return res.status(429).json({ ok: false, message: 'Rate limited, wait 3s' });
    }
    map.set(deviceId, now);

    if (map.size > 50000) map.clear();
    next();
  };
};
