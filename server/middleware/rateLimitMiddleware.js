const rateLimit = require("express-rate-limit");

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes"
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests from this IP, please try again later.",
      retryAfter: "15 minutes"
    });
  }
});

// Strict rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    error: "Too many authentication attempts, please try again later.",
    retryAfter: "15 minutes"
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many authentication attempts, please try again later.",
      retryAfter: "15 minutes"
    });
  }
});

// Message sending rate limiting
const messageLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 messages per minute
  message: {
    error: "Too many messages sent, please slow down.",
    retryAfter: "1 minute"
  },
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many messages sent, please slow down.",
      retryAfter: "1 minute"
    });
  }
});

// File upload rate limiting
const uploadLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit each IP to 10 file uploads per 5 minutes
  message: {
    error: "Too many file uploads, please try again later.",
    retryAfter: "5 minutes"
  },
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many file uploads, please try again later.",
      retryAfter: "5 minutes"
    });
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  messageLimiter,
  uploadLimiter
};
