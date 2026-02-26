// Simple in-memory rate limiter
// Tracks request counts per IP in a sliding window

const store = new Map();

function cleanExpired(windowMs) {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now - entry.windowStart > windowMs * 2) {
      store.delete(key);
    }
  }
}

export function createRateLimiter({ windowMs = 15 * 60 * 1000, max = 20, message = 'Too many requests, please try again later' } = {}) {
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    // Periodically clean expired entries
    if (Math.random() < 0.01) cleanExpired(windowMs);

    const entry = store.get(ip);

    if (!entry || now - entry.windowStart > windowMs) {
      store.set(ip, { windowStart: now, count: 1 });
      return next();
    }

    entry.count += 1;

    if (entry.count > max) {
      const retryAfter = Math.ceil((windowMs - (now - entry.windowStart)) / 1000);
      res.set('Retry-After', retryAfter);
      return res.status(429).json({ success: false, error: message });
    }

    next();
  };
}
