/**
 * Pins Module - Handles pin card rendering and pin-related operations
 * Manages displaying, creating, editing, and deleting pins
 */

import { createElement, appendChild, clear } from './dom.js';
import * as api from './api.js';
import { generateColorFromString } from './helper.js';

// All pins storage
let allPins = [];

/**
 * Create a pin card element
 * @param {Object} pin - Pin data object
 * @returns {Element} Link element containing the card
 */
export function createPinCard(pin) {
  // Create link wrapper
  const cardLink = createElement('a', '', {
    href: `details.html?id=${pin.id}`
  });

  // Create article/card element
  const article = createElement('article', 'card');

  // Create image wrapper
  const imgWrapper = createElement('div', 'card-image-wrapper');
  const img = createElement('img', 'card-image', {
    src: pin.image,
    alt: pin.title,
    loading: 'lazy'
  });
  appendChild(imgWrapper, img);
  appendChild(article, imgWrapper);

  // Create kebab menu container
  const kebabContainer = createElement('div', 'kebab-container');
  const kebabBtn = createElement('button', 'kebab-btn');
  const kebabIcon = createElement('i', 'fa-solid fa-ellipsis-vertical');
  appendChild(kebabBtn, kebabIcon);
  appendChild(kebabContainer, kebabBtn);

  // Create kebab menu
  const menu = createElement('div', 'kebab-menu');
  const editOption = createElement('div', 'kebab-menu-item');
  const editIcon = createElement('i', 'fa-solid fa-pencil');
  appendChild(editOption, editIcon);
  editOption.onclick = (e) => {
    e.preventDefault();
    handleEditPin(pin);
  };
  appendChild(menu, editOption);

  const deleteOption = createElement('div', 'kebab-menu-item');
  const deleteIcon = createElement('i', 'fa-solid fa-trash');
  appendChild(deleteOption, deleteIcon);
  deleteOption.onclick = async (e) => {
    e.preventDefault();
    await handleDeletePin(pin.id);
  };
  appendChild(menu, deleteOption);
  appendChild(kebabContainer, menu);
  appendChild(article, kebabContainer);

  // Create card content
  const content = createElement('div', 'card-content');

  // Create title
  const title = createElement('h3', 'card-title', {
    textContent: pin.title
  });
  appendChild(content, title);

  // Create tags
  const tagsDiv = createElement('div', 'tags');
  if (pin.tags && pin.tags.length > 0) {
    pin.tags.forEach(tag => {
      const bgColor = generateColorFromString(tag);
      const span = createElement('span', 'tag', {
        textContent: tag,
        style: `background-color: ${bgColor}; color: #333;`
      });
      appendChild(tagsDiv, span);
    });
  }
  appendChild(content, tagsDiv);

  appendChild(article, content);
  appendChild(cardLink, article);

  return cardLink;
}

/**
 * Render all pins in card view
 * @param {Array<Object>} pins - Array of pin objects
 */
export function renderPins(pins) {
  allPins = pins; // Store all pins

  renderCardsView(pins);
}

/**
 * Get unique tags from all pins
 * @returns {Array<string>} Array of unique tags
 */
export function getUniqueTags() {
  const tagsSet = new Set();
  allPins.forEach(pin => {
    if (pin.tags) {
      pin.tags.forEach(tag => tagsSet.add(tag));
    }
  });
  return Array.from(tagsSet).sort();
}

/**
 * Sort pins based on criteria
 * @param {string} sortBy - Sort criteria: 'name', 'newest', 'oldest', 'this-month'
 * @returns {Array<Object>} Sorted pins
 */
export function sortPins(sortBy) {
  let sorted = [...allPins];

  switch (sortBy) {
    case 'name':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'newest':
      sorted.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
      break;
    case 'oldest':
      sorted.sort((a, b) => new Date(a.creationDate) - new Date(b.creationDate));
      break;
    case 'this-month':
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      sorted = sorted.filter(pin => {
        const pinDate = new Date(pin.creationDate);
        return pinDate.getMonth() === thisMonth && pinDate.getFullYear() === thisYear;
      });
      sorted.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
      break;
    default:
      break;
  }

  return sorted;
}

/**
 * Render pins in card/masonry view
 * @param {Array<Object>} pins - Array of pin objects
 */
export function renderCardsView(pins) {
  const cardsView = document.querySelector('.masonry-grid');
  if (!cardsView) return;

  clear(cardsView);

  if (!pins || pins.length === 0) {
    const p = createElement('p', '', {
      textContent: 'Nenhum pin encontrado.'
    });
    appendChild(cardsView, p);
    return;
  }

  pins.forEach(pin => {
    const cardLink = createPinCard(pin);
    appendChild(cardsView, cardLink);
  });
}

/**
 * Handle edit pin action
 * @param {Object} pin - Pin object to edit
 */
export function handleEditPin(pin) {
  const editModal = document.getElementById('editModal');
  if (!editModal) return;

  preFillEditForm(pin, editModal);

  // Show modal
  editModal.style.display = 'block';
}

/**
 * Pre-fill edit form with pin data
 * @param {Object} pin - Pin object
 * @param {Element} formElement - Form element to fill
 */
export function preFillEditForm(pin, formElement) {
  const idField = formElement.querySelector('#editPinId, #pinId');
  const titleField = formElement.querySelector('#editTitle, #title');
  const tagsField = formElement.querySelector('#editTags, #tags');
  const difficultyField = formElement.querySelector('#editDifficulty, #difficulty');
  const timeField = formElement.querySelector('#editTime, #time');
  const costField = formElement.querySelector('#editProductionCost, #productionCost');
  const materialsField = formElement.querySelector('#editUsedMaterials, #usedMaterials');

  if (idField) idField.value = pin.id;
  if (titleField) titleField.value = pin.title;
  if (tagsField) tagsField.value = pin.tags ? pin.tags.join(', ') : '';
  if (difficultyField) difficultyField.value = pin.difficulty || '';
  if (timeField) timeField.value = pin.time || '';
  if (costField) costField.value = pin.productionCost || '';
  if (materialsField) materialsField.value = pin.usedMaterials ? pin.usedMaterials.join(', ') : '';
}

/**
 * Handle delete pin action
 * @param {number} pinId - ID of pin to delete
 */
export async function handleDeletePin(pinId) {
  if (!confirm('Are you sure you want to delete this pin?')) {
    return;
  }

  try {
    const response = await api.deletePin(pinId);
    if (response.ok) {
      // Reload pins after successful deletion
      const pins = await api.loadPins();
      renderPins(pins);
    } else {
      alert('Erro ao apagar o pin.');
    }
  } catch (error) {
    console.error('Error deleting pin:', error);
    alert('Erro ao apagar o pin.');
  }
}

/**
 * Initialize edit page for a specific pin
 * @param {number} pinId - ID of the pin to edit
 */
export async function initializeEditPage(pinId) {
  if (!pinId) return;

  // Set hidden field and form action
  const pinIdField = document.getElementById('pinId');
  const editForm = document.getElementById('editForm');
  if (pinIdField) pinIdField.value = pinId;
  if (editForm) editForm.action = `/edit_pin/${pinId}`;

  // Load pin data and pre-fill form
  try {
    const api = await import('./api.js');
    const pin = await api.getPin(pinId);
    if (pin) {
      preFillEditForm(pin, editForm || document);
    }
  } catch (error) {
    console.error('Error initializing edit page:', error);
  }
}
