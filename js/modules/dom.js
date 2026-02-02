/**
 * DOM Module - Handles DOM (Document Object Model) selection, manipulation, and event
 */

/**
 * Query selector wrapper with error handling
 * @param {string} selector - CSS selector
 * @returns {Element|null} The DOM element or null if not found
 */
export function getElement(selector) {
  try {
    return document.querySelector(selector);
  } catch (error) {
    console.warn(`Invalid selector: ${selector}`);
    return null;
  }
}

/**
 * Query selector all wrapper
 * @param {string} selector - CSS selector
 * @returns {NodeList} Collection of DOM elements
 */
export function getElements(selector) {
  try {
    return document.querySelectorAll(selector);
  } catch (error) {
    console.warn(`Invalid selector: ${selector}`);
    return [];
  }
}

/**
 * Get element by ID
 * @param {string} id - Element ID
 * @returns {Element|null} The DOM element or null if not found
 */
export function getElementById(id) {
  return document.getElementById(id) || null;
}

/**
 * Get elements by class name
 * @param {string} className - Class name
 * @returns {HTMLCollection} Collection of DOM elements
 */
export function getByClassName(className) {
  return document.getElementsByClassName(className);
}

/**
 * Add event listener to element
 * @param {Element|string} element - DOM element or selector
 * @param {string} eventType - Event type (e.g., 'click', 'submit')
 * @param {Function} handler - Event handler function
 */
export function addEventListener(element, eventType, handler) {
  const el = typeof element === 'string' ? getElement(element) : element;
  if (el) {
    el.addEventListener(eventType, handler);
  }
}

/**
 * Add event listeners to multiple elements
 * @param {NodeList|Array} elements - Collection of elements
 * @param {string} eventType - Event type
 * @param {Function} handler - Event handler function
 */
export function addEventListeners(elements, eventType, handler) {
  elements.forEach(element => {
    element.addEventListener(eventType, handler);
  });
}

/**
 * Remove event listener
 * @param {Element|string} element - DOM element or selector
 * @param {string} eventType - Event type
 * @param {Function} handler - Event handler function
 */
export function removeEventListener(element, eventType, handler) {
  const el = typeof element === 'string' ? getElement(element) : element;
  if (el) {
    el.removeEventListener(eventType, handler);
  }
}

/**
 * Create an HTML element with optional attributes
 * @param {string} tagName - HTML tag name
 * @param {string} [className] - CSS class name
 * @param {Object} [attributes] - Object with attribute names and values
 * @returns {Element} The created element
 */
export function createElement(tagName, className = '', attributes = {}) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'innerHTML') {
      element.innerHTML = value;
    } else if (key === 'textContent') {
      element.textContent = value;
    } else if (key.startsWith('data-')) {
      element.setAttribute(key, value);
    } else {
      element.setAttribute(key, value);
    }
  });
  return element;
}

/**
 * Set element text content
 * @param {Element|string} element - DOM element or selector
 * @param {string} text - Text content
 */
export function setText(element, text) {
  const el = typeof element === 'string' ? getElement(element) : element;
  if (el) {
    el.textContent = text;
  }
}

/**
 * Set element HTML content
 * @param {Element|string} element - DOM element or selector
 * @param {string} html - HTML content
 */
export function setHTML(element, html) {
  const el = typeof element === 'string' ? getElement(element) : element;
  if (el) {
    el.innerHTML = html;
  }
}

/**
 * Add class to element
 * @param {Element|string} element - DOM element or selector
 * @param {string} className - Class name to add
 */
export function addClass(element, className) {
  const el = typeof element === 'string' ? getElement(element) : element;
  if (el) {
    el.classList.add(className);
  }
}

/**
 * Remove class from element
 * @param {Element|string} element - DOM element or selector
 * @param {string} className - Class name to remove
 */
export function removeClass(element, className) {
  const el = typeof element === 'string' ? getElement(element) : element;
  if (el) {
    el.classList.remove(className);
  }
}

/**
 * Toggle class on element
 * @param {Element|string} element - DOM element or selector
 * @param {string} className - Class name to toggle
 */
export function toggleClass(element, className) {
  const el = typeof element === 'string' ? getElement(element) : element;
  if (el) {
    el.classList.toggle(className);
  }
}

/**
 * Check if element has class
 * @param {Element|string} element - DOM element or selector
 * @param {string} className - Class name to check
 * @returns {boolean} True if element has class
 */
export function hasClass(element, className) {
  const el = typeof element === 'string' ? getElement(element) : element;
  return el ? el.classList.contains(className) : false;
}

/**
 * Set element visibility
 * @param {Element|string} element - DOM element or selector
 * @param {boolean} isVisible - Visibility flag
 */
export function setVisible(element, isVisible) {
  const el = typeof element === 'string' ? getElement(element) : element;
  if (el) {
    el.style.display = isVisible ? '' : 'none';
  }
}

/**
 * Get element attribute
 * @param {Element|string} element - DOM element or selector
 * @param {string} attribute - Attribute name
 * @returns {string|null} Attribute value or null
 */
export function getAttribute(element, attribute) {
  const el = typeof element === 'string' ? getElement(element) : element;
  return el ? el.getAttribute(attribute) : null;
}

/**
 * Set element attribute
 * @param {Element|string} element - DOM element or selector
 * @param {string} attribute - Attribute name
 * @param {string} value - Attribute value
 */
export function setAttribute(element, attribute, value) {
  const el = typeof element === 'string' ? getElement(element) : element;
  if (el) {
    el.setAttribute(attribute, value);
  }
}

/**
 * Append child element(s)
 * @param {Element} parent - Parent element
 * @param {Element|Array<Element>} children - Child element(s) to append
 */
export function appendChild(parent, children) {
  if (Array.isArray(children)) {
    children.forEach(child => parent.appendChild(child));
  } else {
    parent.appendChild(children);
  }
}

/**
 * Clear all child elements
 * @param {Element|string} element - DOM element or selector
 */
export function clear(element) {
  const el = typeof element === 'string' ? getElement(element) : element;
  if (el) {
    el.innerHTML = '';
  }
}

/**
 * Scroll element into view
 * @param {Element|string} element - DOM element or selector
 * @param {Object} [options] - Scroll options (behavior, block, inline)
 */
export function scrollIntoView(element, options = { behavior: 'smooth' }) {
  const el = typeof element === 'string' ? getElement(element) : element;
  if (el) {
    el.scrollIntoView(options);
  }
}

/**
 * Get form data as object
 * @param {Element|string} formElement - Form element or selector
 * @returns {Object} Form data as key-value pairs
 */
export function getFormData(formElement) {
  const form = typeof formElement === 'string' ? getElement(formElement) : formElement;
  if (!form) return {};
  
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    if (data[key]) {
      // Handle multiple values for same key (e.g., checkboxes)
      if (Array.isArray(data[key])) {
        data[key].push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      data[key] = value;
    }
  });
  return data;
}

/**
 * Reset form
 * @param {Element|string} formElement - Form element or selector
 */
export function resetForm(formElement) {
  const form = typeof formElement === 'string' ? getElement(formElement) : formElement;
  if (form) {
    form.reset();
  }
}
