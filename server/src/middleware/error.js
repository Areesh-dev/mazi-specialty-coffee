export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  if (err.code && err.code.startsWith('P')) {
    return res.status(400).json({ success: false, message: 'Database constraint violation.' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({ success: false, message: `API route not found: ${req.method} ${req.originalUrl}` });
};