// Error handling middleware
function notFound(req, res, next) {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  error.code = 'ROUTE_NOT_FOUND';
  next(error);
}

function errorHandler(err, req, res, next) {
  let error = { ...err };
  error.message = err.message;

  // Log error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new Error(message);
    error.statusCode = 404;
    error.code = 'RESOURCE_NOT_FOUND';
  }

  // Mongoose duplicate key
  if (err.code === 11000 || err.code === 'E11000') {
    const fields = err.keyValue || {};
    const fieldNames = Object.keys(fields);
    const fieldStr = fieldNames.length ? `${fieldNames[0]}: ${fields[fieldNames[0]]}` : undefined;
    
    error = new Error('Duplicate field value');
    error.statusCode = 409;
    error.code = 'DUPLICATE_FIELD';
    error.details = {
      fields,
      hint: fieldStr,
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = 'Validation Error';
    const details = Object.values(err.errors).map(val => ({
      field: val.path,
      message: val.message,
      value: val.value
    }));
    
    error = new Error(message);
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
    error.details = details;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new Error('Invalid token');
    error.statusCode = 401;
    error.code = 'INVALID_TOKEN';
  }

  if (err.name === 'TokenExpiredError') {
    error = new Error('Token expired');
    error.statusCode = 401;
    error.code = 'TOKEN_EXPIRED';
  }

  // Rate limit errors
  if (err.status === 429) {
    error = new Error('Too many requests');
    error.statusCode = 429;
    error.code = 'RATE_LIMIT_EXCEEDED';
  }

  // CORS errors
  if (err.message && err.message.includes('CORS')) {
    error = new Error('CORS policy violation');
    error.statusCode = 403;
    error.code = 'CORS_ERROR';
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  const code = error.code || 'INTERNAL_ERROR';

  const response = {
    success: false,
    message,
    code,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    ...(error.details && { details: error.details }),
    ...(error.fields && { fields: error.fields })
  };

  res.status(statusCode).json(response);
}

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { 
  notFound, 
  errorHandler, 
  asyncHandler 
};
