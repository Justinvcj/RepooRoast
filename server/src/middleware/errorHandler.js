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
  
  // Let's actually show the configuration errors to the user so they can fix their environment variables!
  if (safeMessage.includes('GEMINI_API_KEY is not configured')) {
    safeMessage = 'The GEMINI_API_KEY environment variable is missing on the server. Please add it to your Render dashboard.';
  } else if (safeMessage.includes('GITHUB_TOKEN on the server is invalid')) {
    safeMessage = 'The GITHUB_TOKEN on the server is invalid or expired. Please generate a new one and update your Render dashboard.';
  }

  // In production, mask generic 500 errors entirely, UNLESS they are specific API errors we want the user to see
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    if (!safeMessage.startsWith('GitHub API') && !safeMessage.startsWith('Gemini AI') && !safeMessage.includes('Repository')) {
       safeMessage = 'Internal Server Error';
    }
  }

  // Format the standard JSON response
  const errorResponse = {
    success: false,
    error: safeMessage
  };

  if (res.headersSent) {
    res.write(JSON.stringify(errorResponse));
    return res.end();
  } else {
    return res.status(statusCode).json(errorResponse);
  }
};

export default errorHandler;
