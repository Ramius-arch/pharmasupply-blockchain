const stringUtils = {
  /**
   * Capitalize the first letter of a string
   * @param {string} str - The input string
   * @returns {string} String with the first letter capitalized
   */
  capitalizeFirstLetter: (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /**
   * Generate a random string of specified length
   * @param {number} len - The desired length of the string
   * @returns {string} Randomly generated string
   */
  generateRandomString: (len = 8) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < len; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  },

  /**
   * Validate email format
   * @param {string} email - The email address to validate
   * @returns {boolean} True if the email is valid, false otherwise
   */
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Limit text length for display purposes
   * @param {string} str - The input string
   * @param {number} maxLength - Maximum allowed length
   * @returns {string} Truncated string if it exceeds the maximum length
   */
  limitTextLength: (str, maxLength) => {
    if (!str || str.length <= maxLength) return str;
    return str.substring(0, maxLength) + "...";
  },
};

export default stringUtils;
