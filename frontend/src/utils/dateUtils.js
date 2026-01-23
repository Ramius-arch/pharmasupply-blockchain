import { format, add, sub } from 'date-fns';

const dateUtils = {
  /**
   * Format a date to display in a user-friendly way
   * @param {Date} date - The date to format
   * @param {string} pattern - The desired output format (e.g., "MM/dd/yyyy")
   * @returns {string} Formatted date string
   */
  formatDate: (date, pattern = "MM/dd/yyyy") => {
    if (!date) return "";
    return format(date, pattern);
  },

  /**
   * Calculate the time difference between two dates in human-readable format
   * @param {Date} date1 - The first date
   * @param {Date} date2 - The second date
   * @returns {string} Time difference string (e.g., "2 days ago")
   */
  timeDifference: (date1, date2) => {
    const diff = Math.abs(date1 - date2);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return "just now";
    } else if (days === 1) {
      return "yesterday";
    } else {
      return `${days} days ago`;
    }
  },

  /**
   * Add or subtract days from a date
   * @param {Date} date - The base date
   * @param {number} days - Number of days to add (positive) or subtract (negative)
   * @returns {Date} New date after modification
   */
  modifyDate: (date, days) => {
    if (!date) return new Date();
    return add(date, { days });
  },

  /**
   * Get the first day of the month for a given date
   * @param {Date} date - The input date
   * @returns {Date} First day of the month
   */
  firstDayOfMonth: (date) => {
    if (!date) return new Date();
    return sub(new Date(format(date, 'yyyy-MM') + '-01'), { days: 1 });
  },

  /**
   * Get the last day of the month for a given date
   * @param {Date} date - The input date
   * @returns {Date} Last day of the month
   */
  lastDayOfMonth: (date) => {
    if (!date) return new Date();
    return add(new Date(format(date, 'yyyy-MM') + '-01'), { months: 1, days: -1 });
  },
};

export default dateUtils;
