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
  
  // Sanitize the error message
  let safeMessage = err.message || 'Server Error';
  
  // Never leak API keys or tokens in error messages
  if (safeMessage.toLowerCase().includes('api_key') || safeMessage.toLowerCase().includes('token')) {
    safeMessage = 'A configuration error occurred on the server.';
  }

  // In production, mask generic 500 errors entirely, UNLESS they are specific API errors we want the user to see
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    if (!safeMessage.startsWith('GitHub API') && !safeMessage.startsWith('Gemini AI') && !safeMessage.includes('Repository')) {
       safeMessage = 'Internal Server Error';
    }
  }

  // Format the standard JSON response
  res.status(statusCode).json({
    success: false,
    error: safeMessage
  });
};

export default errorHandler;
