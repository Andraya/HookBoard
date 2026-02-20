/**
 * Timer Module - Handles timer functionality
 * Timer state, display updates, and event handling
 */

import { getElement, getElementById, setText } from './dom.js';

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
 * Timer class to manage timer state and operations
 */
export class Timer {
  constructor() {
    this.timerInterval = null;
    this.timerSeconds = 0;
    this.isRunning = false;
  }

  /**
   * Start the timer
   */
  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.timerInterval = setInterval(() => {
        this.timerSeconds++;
        this.updateDisplay();
      }, 1000);
    }
  }

  /**
   * Pause the timer
   */
  pause() {
    if (this.isRunning) {
      this.isRunning = false;
      clearInterval(this.timerInterval);
    }
  }

  /**
   * Reset the timer
   */
  reset() {
    this.pause();
    this.timerSeconds = 0;
    this.updateDisplay();
  }

  /**
   * Toggle timer between running and paused
   */
  toggle() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  /**
   * Update timer display
   */
  updateDisplay() {
    const timerDisplay = getElementById('timerDisplay');
    if (timerDisplay) {
      setText(timerDisplay, formatTime(this.timerSeconds));
    }
  }

  /**
   * Get current time in seconds
   * @returns {number} Current timer value
   */
  getTime() {
    return this.timerSeconds;
  }

  /**
   * Set timer to specific time (in seconds)
   * @param {number} seconds - Seconds to set
   */
  setTime(seconds) {
    this.timerSeconds = Math.max(0, seconds);
    this.updateDisplay();
  }

  /**
   * Check if timer is running
   * @returns {boolean} Running state
   */
  getRunningState() {
    return this.isRunning;
  }
}

/**
 * Initialize timer with event listeners
 * @param {Timer} timer - Timer instance
 */
export function initializeTimer(timer) {
  const resetDockBtn = getElement('.btn-reset-dock');
  const timerDisplay = getElement('.timer-display');

  if (resetDockBtn) {
    resetDockBtn.addEventListener('click', () => timer.reset());
  }

  if (timerDisplay) {
    timerDisplay.addEventListener('click', () => timer.toggle());
  }

  // Initial display update
  timer.updateDisplay();
}
