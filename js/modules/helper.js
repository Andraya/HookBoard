/**
 * Helper Module - Helper functions for common tasks
 * Includes formatting, and other utility functions
 */

// Array to keep track of used hues for tag colors
let usedHues = [];

/**
 * Get the list of used hues
 * @returns {Array<number>} Array of used hues
 */
function getUsedHues() {
  return usedHues;
}

/**
 * Format time in seconds to HH:MM:SS format
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time string
 */
export function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Parse comma-separated string into array
 * @param {string} str - Comma-separated string
 * @returns {Array<string>} Array of trimmed strings
 */
export function parseCommaList(str) {
  if (!str) return [];
  return str.split(',').map(item => item.trim()).filter(item => item);
}

/**
 * Join array into comma-separated string
 * @param {Array<string>} arr - Array of strings
 * @returns {string} Comma-separated string
 */
export function joinCommaList(arr) {
  return arr.join(', ');
}

/**
 * Convert price string to number
 * @param {string} priceStr - Price string (e.g., "€15.99" or "$10")
 * @returns {number} Price as number
 */
export function parsePrice(priceStr) {
  if (!priceStr) return 0;
  const priceNum = priceStr.replace(/[^\d.,]/g, '');
  return parseFloat(priceNum.replace(',', '.'));
}

/**
 * Format price as string with 2 decimal places
 * @param {number} price - Price as number
 * @returns {string} Formatted price
 */
export function formatPrice(price) {
  return `€${parseFloat(price).toFixed(2)}`;
}

/**
 * Capitalize first letter of string
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert string to title case
 * @param {string} str - Input string
 * @returns {string} Title case string
 */
export function toTitleCase(str) {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => capitalize(word)).join(' ');
}

/**
 * Truncate string to specified length
 * @param {string} str - Input string
 * @param {number} length - Max length
 * @param {string} [suffix] - Suffix to add (default: "...")
 * @returns {string} Truncated string
 */
export function truncate(str, length, suffix = '...') {
  if (!str || str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Compare two arrays for equality
 * @param {Array} arr1 - First array
 * @param {Array} arr2 - Second array
 * @returns {boolean} True if arrays are equal
 */
export function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((val, idx) => val === arr2[idx]);
}

/**
 * Get query parameter from URL
 * @param {string} paramName - Parameter name
 * @returns {string|null} Parameter value or null
 */
export function getQueryParam(paramName) {
  const params = new URLSearchParams(window.location.search);
  return params.get(paramName);
}

/**
 * Get all query parameters from URL
 * @returns {Object} Object with all query parameters
 */
export function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const obj = {};
  params.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

/**
 * Check if string is empty or whitespace only
 * @param {string} str - String to check
 * @returns {boolean} True if empty
 */
export function isEmpty(str) {
  return !str || str.trim().length === 0;
}

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if empty
 */
export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Wait for specified milliseconds
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Resolves after delay
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get file extension from filename
 * @param {string} filename - Filename
 * @returns {string} File extension
 */
export function getFileExtension(filename) {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

/**
 * Convert bytes to human-readable size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Sort array of objects by property
 * @param {Array<Object>} arr - Array to sort
 * @param {string} property - Property to sort by
 * @param {boolean} [ascending] - Sort direction (default: true)
 * @returns {Array<Object>} Sorted array
 */
export function sortBy(arr, property, ascending = true) {
  return [...arr].sort((a, b) => {
    if (a[property] < b[property]) return ascending ? -1 : 1;
    if (a[property] > b[property]) return ascending ? 1 : -1;
    return 0;
  });
}

/**
 * Filter array by property value
 * @param {Array<Object>} arr - Array to filter
 * @param {string} property - Property to filter by
 * @param {*} value - Value to match
 * @returns {Array<Object>} Filtered array
 */
export function filterBy(arr, property, value) {
  return arr.filter(item => item[property] === value);
}

/**
 * Group array by property
 * @param {Array<Object>} arr - Array to group
 * @param {string} property - Property to group by
 * @returns {Object} Grouped object
 */
export function groupBy(arr, property) {
  return arr.reduce((groups, item) => {
    const key = item[property];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
}

/**
 * Generate a consistent pastel color from a string using hash
 * @param {string} str - String to hash
 * @returns {string} HSL color string
 */
export function generateColorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let hue = Math.abs(hash) % 360;

  // Check if hue is too close to existing ones (within 30 degrees)
  const minDistance = 30;
  let attempts = 0;
  while (usedHues.some(usedHue => Math.abs(hue - usedHue) < minDistance || Math.abs(hue - usedHue - 360) < minDistance) && attempts < 12) {
    hue = (hue + 30) % 360;
    attempts++;
  }

  // Add to used hues
  usedHues.push(hue);

  const saturation = 30; // Low saturation for pastel effect
  const lightness = 75; // High lightness for pastel effect
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
