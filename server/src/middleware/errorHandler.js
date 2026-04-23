/**
 * Global error handling middleware for Express.
 * Catches all errors passed to next() and formats them into a standard JSON response.
 *
 * @param {Error} err - The error object.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  // Log the error stack to the console for debugging
  console.error('[Error Handler]', err.stack);

  // Determine the appropriate status code
  const statusCode = err.status || 500;

  // Format the standard JSON response
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Server Error'
  });
};

export default errorHandler;
