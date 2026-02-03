/**
 * API Module - Handles all backend communication and data fetching
 * Centralizes all fetch operations to the backend API
 */

/**
 * Load pins from backend
 * @returns {Promise<Array>} Array of pin objects
 */
export async function loadPins() {
  try {
    const response = await fetch('/data/pins.json');
    if (!response.ok) throw new Error('Failed to load pins.json');
    const pins = await response.json();
    return pins;
  } catch (error) {
    console.error('Error loading pins:', error);
    throw error;
  }
}

/**
 * Get a single pin by ID
 * @param {number} pinId - The ID of the pin to retrieve
 * @returns {Promise<Object|null>} Pin object or null if not found
 */
export async function getPin(pinId) {
  try {
    const pins = await loadPins();
    return pins.find(pin => pin.id == pinId) || null;
  } catch (error) {
    console.error('Error getting pin:', error);
    throw error;
  }
}

/**
 * Delete a pin by ID
 * @param {number} pinId - The ID of the pin to delete
 * @returns {Promise<Response>} Response from delete operation
 */
export async function deletePin(pinId) {
  try {
    const response = await fetch(`/delete_pin/${pinId}`, { method: 'POST' });
    return response;
  } catch (error) {
    console.error('Error deleting pin:', error);
    throw error;
  }
}

/**
 * Edit a pin
 * @param {number} pinId - The ID of the pin to edit
 * @param {FormData} formData - Form data with updated pin information
 * @returns {Promise<Response>} Response from edit operation
 */
export async function editPin(pinId, formData) {
  try {
    const response = await fetch(`/edit_pin/${pinId}`, {
      method: 'POST',
      body: formData
    });
    return response;
  } catch (error) {
    console.error('Error editing pin:', error);
    throw error;
  }
}

/**
 * Load stash items from backend
 * @returns {Promise<Array>} Array of stash item objects
 */
export async function loadStashItems() {
  try {
    const response = await fetch('/data/stash.json');
    if (!response.ok) throw new Error('Failed to load stash.json');
    const items = await response.json();
    return items;
  } catch (error) {
    console.error('Error loading stash items:', error);
    throw error;
  }
}

/**
 * Add a new stash item
 * @param {FormData} formData - Form data with stash item information
 * @returns {Promise<Response>} Response from add operation
 */
export async function addStashItem(formData) {
  try {
    const response = await fetch('/add_item', {
      method: 'POST',
      body: formData
    });
    return response;
  } catch (error) {
    console.error('Error adding stash item:', error);
    throw error;
  }
}

/**
 * Update a stash item
 * @param {number} itemId - The ID of the item to update
 * @param {FormData} formData - Form data with updated item information
 * @returns {Promise<Response>} Response from update operation
 */
export async function updateStashItem(itemId, formData) {
  try {
    const response = await fetch(`/update_item/${itemId}`, {
      method: 'POST',
      body: formData
    });
    return response;
  } catch (error) {
    console.error('Error updating stash item:', error);
    throw error;
  }
}

/**
 * Delete a stash item
 * @param {number} itemId - The ID of the item to delete
 * @returns {Promise<Response>} Response from delete operation
 */
export async function deleteStashItem(itemId) {
  try {
    const response = await fetch(`/delete_item/${itemId}`, { method: 'POST' });
    return response;
  } catch (error) {
    console.error('Error deleting stash item:', error);
    throw error;
  }
}

/**
 * Scrape information from a URL (Hobbii-specific or generic)
 * @param {string} url - The URL to scrape
 * @returns {Promise<Object>} Scraped data (name, brand, composition, etc.)
 */
export async function scrapeUrl(url) {
  try {
    const response = await fetch('/scrape_url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error('Error scraping URL:', error);
    throw error;
  }
}

/**
 * Get a single pin by ID from the pins array
 * @param {Array<Object>} pins - Array of pin objects
 * @param {number} pinId - The ID to search for
 * @returns {Object|null} The pin object or null if not found
 */
export function getPinById(pins, pinId) {
  return pins.find(p => p.id == pinId) || null;
}

/**
 * Get a single stash item by ID from the items array
 * @param {Array<Object>} items - Array of stash item objects
 * @param {number} itemId - The ID to search for
 * @returns {Object|null} The item object or null if not found
 */
export function getStashItemById(items, itemId) {
  return items.find(item => item.id == itemId) || null;
}

/**
 * Load calculator products from backend
 * @returns {Promise<Array>} Array of product objects
 */
export async function loadCalculatorProducts() {
  try {
    const response = await fetch('/data/calculator.json');
    if (!response.ok) throw new Error('Failed to load calculator.json');
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error loading calculator products:', error);
    return [];
  }
}

/**
 * Save calculator products to backend
 * @param {Array<Object>} products - Array of product objects to save
 * @returns {Promise<Response>} Response from save operation
 */
export async function saveCalculatorProducts(products) {
  try {
    const response = await fetch('/save_calculator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(products)
    });
    if (!response.ok) throw new Error('Failed to save calculator products');
    return response;
  } catch (error) {
    console.error('Error saving calculator products:', error);
    throw error;
  }
}

/**
 * Delete a calculator product
 * @param {number} productId - The ID of the product to delete
 * @returns {Promise<Response>} Response from delete operation
 */
export async function deleteCalculatorProduct(productId) {
  try {
    const response = await fetch(`/delete_calculator_product/${productId}`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to delete calculator product');
    return response;
  } catch (error) {
    console.error('Error deleting calculator product:', error);
    throw error;
  }
}
