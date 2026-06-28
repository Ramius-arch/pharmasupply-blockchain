const validationUtils = {
  /**
   * Validate required fields in an object
   * @param {object} data - The object to validate
   * @param {string[]} requiredFields - Array of required field names
   * @returns {boolean} True if all required fields are present, false otherwise
   */
  validateRequiredFields: (data, requiredFields) => {
    if (!requiredFields || requiredFields.length === 0) return true;
    for (const field of requiredFields) {
      if (!(field in data)) {
        console.warn(`Missing required field: ${field}`);
        return false;
      }
    }
    return true;
  },

  /**
   * Validate password strength
   * Requires at least 8 characters, one uppercase, one lowercase, and one number
   * @param {string} password - The password to validate
   * @returns {boolean} True if the password is strong enough, false otherwise
   */
  isStrongPassword: (password) => {
    if (!password || password.length < 8) return false;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasUppercase && hasLowercase && hasNumber;
  },

  /**
   * Sanitize input to prevent XSS attacks
   * @param {string} str - The input string to sanitize
   * @returns {string} Sanitized string
   */
  sanitizeInput: (str) => {
    if (!str) return "";
    const sanitized = str.replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
    return sanitized;
  },
};

export default validationUtils;
