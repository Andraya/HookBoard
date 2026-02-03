/**
 * Calculator Module - Handles production cost and inventory calculations
 * Manages pricing, markup calculations, and product storage
 */

import * as api from './api.js';
//this constants will later on be obtained from a stock file
const PRECO_ENCH_G = 0.01829;
const EXTRAS_BASE = [
  { name: "Olhos 12mm", price: 0.116 },
  { name: "Chaveiro", price: 0.07 },
  { name: "Olhos 16mm", price: 0.24 }
];

const YARN_TYPES = {
  "baby-snuggle": { name: "Baby Snuggle Solid", normal: 0.08, promo: 0.044 },
  "honey-bunny": { name: "Honey Bunny", normal: 0.079, promo: 0.054 },
  "rainbow-cotton": { name: "Rainbow Cotton 8/8", normal: 0.045, promo: 0.045 }
};

/**
 * Calculate production costs
 * @param {Object} data - Product data
 * @returns {Object} Calculated costs breakdown
 */
export function calculateCosts(data) {
  const {
    totalWeight = 0,
    yarnWeight = 0,
    yarnType = "baby-snuggle",
    hours = 0,
    extras = [],
    salePrice = 0
  } = data;

  const yarn = YARN_TYPES[yarnType] || YARN_TYPES["baby-snuggle"];
  const fillingWeight = Math.max(0, totalWeight - yarnWeight);

  // Cost breakdown
  const yarnCostNormal = yarnWeight * yarn.normal;
  const yarnCostPromo = yarnWeight * yarn.promo;
  const fillingCost = fillingWeight * PRECO_ENCH_G;
  const laborCost = hours * 1.0;

  let extrasCost = 0;
  extras.forEach(extra => {
    extrasCost += (extra.price || 0) * (extra.quantity || 0);
  });

  const totalNormal = yarnCostNormal + fillingCost + extrasCost + laborCost;
  const totalPromo = yarnCostPromo + fillingCost + extrasCost + laborCost;

  const profitNormal = salePrice - totalNormal;
  const profitPromo = salePrice - totalPromo;

  return {
    yarnCostNormal,
    yarnCostPromo,
    fillingCost,
    laborCost,
    extrasCost,
    totalNormal,
    totalPromo,
    salePrice,
    profitNormal,
    profitPromo
  };
}

/**
 * Calculate suggested markup prices
 * @param {number} baseCost - Base cost (normal mode)
 * @returns {Object} Suggested prices for different markups
 */
export function calculateMarkups(baseCost) {
  return {
    markup10: baseCost * 1.1,
    markup25: baseCost * 1.25,
    markup50: baseCost * 1.5,
    markup100: baseCost * 2.0
  };
}

/**
 * Create a product record
 * @param {Object} productData - Product information
 * @returns {Object} Formatted product record
 */
export function createProductRecord(productData) {
  const costs = calculateCosts(productData);

  return {
    id: Date.now(),
    name: productData.name || "Sem Nome",
    color: productData.color || "---",
    hook: productData.hook || "---",
    yarnType: productData.yarnType || "baby-snuggle",
    totalWeight: productData.totalWeight || 0,
    yarnWeight: productData.yarnWeight || 0,
    hours: productData.hours || 0,
    extras: productData.extras || [],
    ...costs,
    stock: productData.stock || 1,
    sold: productData.sold || 0,
    timestamp: new Date().toISOString()
  };
}

/**
 * Get extra by name
 * @param {string} name - Extra name
 * @returns {Object|null} Extra object or null
 */
export function getExtraByName(name) {
  return EXTRAS_BASE.find(e => e.name === name) || null;
}

/**
 * Get yarn type by key
 * @param {string} key - Yarn type key
 * @returns {Object|null} Yarn type object or null
 */
export function getYarnType(key) {
  return YARN_TYPES[key] || null;
}

/**
 * Get all extras
 * @returns {Array} Array of all available extras
 */
export function getAllExtras() {
  return [...EXTRAS_BASE];
}

/**
 * Get all yarn types
 * @returns {Object} All yarn types
 */
export function getAllYarnTypes() {
  return { ...YARN_TYPES };
}

/**
 * Format currency value
 * @param {number} value - Value to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value) {
  return (Math.round(value * 100) / 100).toFixed(2) + "€";
}

/**
 * Calculate profit margin percentage
 * @param {number} profit - Profit value
 * @param {number} salePrice - Sale price
 * @returns {number} Profit margin percentage (0-100)
 */
export function calculateProfitPercentage(profit, salePrice) {
  if (salePrice === 0) return 0;
  return (profit / salePrice) * 100;
}

/**
 * Format percentage value
 * @param {number} value - Value to format
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value) {
  return Math.round(value) + "%";
}

/**
 * Load products from backend
 * @returns {Promise<Array>} Array of products
 */
export async function loadProducts() {
  try {
    return await api.loadCalculatorProducts();
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

/**
 * Save products to backend
 * @param {Array<Object>} products - Products to save
 * @returns {Promise<Response>} Response from backend
 */
export async function saveProducts(products) {
  try {
    return await api.saveCalculatorProducts(products);
  } catch (error) {
    console.error('Error saving products:', error);
    throw error;
  }
}

/**
 * Delete a product from backend
 * @param {number} productId - Product ID to delete
 * @returns {Promise<Response>} Response from backend
 */
export async function deleteProduct(productId) {
  try {
    return await api.deleteCalculatorProduct(productId);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}
