const errorUtils = {
  /**
   * Log an error to the console with a timestamp
   * @param {Error} err - The error object to log
   */
  logError: (err) => {
    console.error(`[${new Date().toISOString()}] Error:`, err);
  },

  /**
   * Display user-friendly error message based on error type
   * @param {Error} err - The error object
   * @returns {string} User-friendly error message
   */
  getErrorMessage: (err) => {
    if (process.env.NODE_ENV === 'production') {
      return "Something went wrong, please try again later.";
    } else {
      return err.message;
    }
  },

  /**
   * Handle API errors with status codes and messages
   * @param {Response} res - The HTTP response object
   * @param {Error} err - The error object
   */
  handleApiError: (res, err) => {
    console.error("API Error:", err);
    let statusCode = 500;
    let message = "Internal Server Error";

    if (err instanceof SyntaxError && err.message === "Unexpected token '}' in JSON at position 0") {
      statusCode = 400;
      message = "Invalid JSON response from server";
    } else if (err.response) {
      // Handle errors with a response object (e.g., Axios errors)
      statusCode = err.response.status;
      message = err.response.data || message;
    }

    return res.status(statusCode).json({ error: message });
  },
};

export default errorUtils;
