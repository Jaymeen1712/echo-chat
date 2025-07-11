const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

// Security headers middleware
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for Socket.IO compatibility
});

// Compression middleware for better performance
const compressionMiddleware = compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // Compression level (1-9, 6 is default)
  threshold: 1024, // Only compress responses larger than 1KB
});

// Logging middleware
const loggingMiddleware = morgan('combined', {
  skip: (req, res) => {
    // Skip logging for health checks and static assets
    return req.url === '/health' || req.url.startsWith('/static');
  }
});

// Request sanitization middleware
const sanitizeRequest = (req, res, next) => {
  // Remove potentially dangerous characters from request body
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }
  
  // Remove potentially dangerous characters from query parameters
  if (req.query && typeof req.query === 'object') {
    sanitizeObject(req.query);
  }
  
  next();
};

// Helper function to sanitize objects recursively
const sanitizeObject = (obj) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'string') {
        // Remove script tags and other potentially dangerous content
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  }
};

// Request size limiting middleware
const requestSizeLimit = (req, res, next) => {
  const contentLength = parseInt(req.get('Content-Length'));
  const maxSize = 50 * 1024 * 1024; // 50MB limit
  
  if (contentLength && contentLength > maxSize) {
    return res.status(413).json({
      error: 'Request entity too large',
      maxSize: '50MB'
    });
  }
  
  next();
};

// IP whitelist middleware (for admin endpoints)
const ipWhitelist = (allowedIPs = []) => {
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (allowedIPs.length > 0 && !allowedIPs.includes(clientIP)) {
      return res.status(403).json({
        error: 'Access denied from this IP address'
      });
    }
    
    next();
  };
};

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'auth_token']
};

module.exports = {
  securityHeaders,
  compressionMiddleware,
  loggingMiddleware,
  sanitizeRequest,
  requestSizeLimit,
  ipWhitelist,
  corsOptions
};
