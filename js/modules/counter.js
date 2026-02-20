/**
 * Counter Module - Handles counter functionality
 * Counter state, display updates, and event handling
 */

import { getElement, getElementById, setText } from './dom.js';

/**
 * Counter class to manage counter state and operations
 */
export class Counter {
  constructor() {
    this.count = 0;
  }

  /**
   * Increment counter
   */
  increment() {
    this.count++;
    this.updateDisplay();
  }

  /**
   * Decrement counter
   */
  decrement() {
    if (this.count > 0) {
      this.count--;
      this.updateDisplay();
    }
  }

  /**
   * Reset counter
   */
  reset() {
    this.count = 0;
    this.updateDisplay();
  }

  /**
   * Update counter display
   */
  updateDisplay() {
    const counterDisplay = getElement('.counter-display');
    if (counterDisplay) {
      setText(counterDisplay, this.count.toString());
    }
  }

  /**
   * Get current count
   * @returns {number} Current counter value
   */
  getCount() {
    return this.count;
  }

  /**
   * Set counter to specific value
   * @param {number} value - Value to set
   */
  setCount(value) {
    this.count = Math.max(0, value);
    this.updateDisplay();
  }
}

/**
 * Initialize counter with event listeners
 * @param {Counter} counter - Counter instance
 */
export function initializeCounter(counter) {
  const btnPlus = getElement('.btn-plus');
  const btnMinus = getElement('.btn-minus');
  const btnReset = getElement('.counter-controls .btn-reset');

  if (btnPlus) {
    btnPlus.addEventListener('click', () => counter.increment());
  }

  if (btnMinus) {
    btnMinus.addEventListener('click', () => counter.decrement());
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => counter.reset());
  }

  // Initial display update
  counter.updateDisplay();
}
