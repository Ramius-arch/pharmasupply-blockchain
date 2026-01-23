const numberUtils = {
  /**
   * Format a number with commas and two decimal places
   * @param {number} num - The number to format
   * @returns {string} Formatted number string
   */
  formatCurrency: (num) => {
    if (!num) return "0.00";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(num);
  },

  /**
   * Convert a string to number with validation
   * @param {string} str - The string to convert
   * @returns {number|null} Number if conversion is successful, null otherwise
   */
  stringToNumber: (str) => {
    const num = parseFloat(str);
    return isNaN(num) ? null : num;
  },

  /**
   * Apply discount to a price
   * @param {number} price - Original price
   * @param {number} discountPercentage - Discount percentage (e.g., 10 for 10%)
   * @returns {number} Price after discount
   */
  applyDiscount: (price, discountPercentage) => {
    if (!price || !discountPercentage) return price;
    const discountAmount = price * (discountPercentage / 100);
    return price - discountAmount;
  },

  /**
   * Calculate total with tax
   * @param {number} subtotal - Subtotal amount
   * @param {number} taxRate - Tax rate (e.g., 0.1 for 10%)
   * @returns {number} Total amount including tax
   */
  calculateTotal: (subtotal, taxRate) => {
    if (!subtotal || !taxRate) return subtotal;
    const taxAmount = subtotal * taxRate;
    return subtotal + taxAmount;
  },
};

export default numberUtils;
