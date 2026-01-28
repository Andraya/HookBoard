// Timer functionality
let timerInterval;
let timerSeconds = 0;
let isRunning = false;

function updateTimerDisplay() {
  const hours = Math.floor(timerSeconds / 3600);
  const minutes = Math.floor((timerSeconds % 3600) / 60);
  const seconds = timerSeconds % 60;
  const display = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  document.querySelectorAll('.timer-display').forEach(el => el.textContent = display);
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timerInterval = setInterval(() => {
      timerSeconds++;
      updateTimerDisplay();
    }, 1000);
  }
}

function pauseTimer() {
  if (isRunning) {
    isRunning = false;
    clearInterval(timerInterval);
  }
}

function resetTimer() {
  pauseTimer();
  timerSeconds = 0;
  updateTimerDisplay();
}

// Event listeners for timer buttons
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.querySelector('.btn-start');
  const pauseBtn = document.querySelector('.btn-pause');
  const resetBtn = document.querySelector('.btn-reset');
  const resetDockBtn = document.querySelector('.btn-reset-dock');
  const timerIcon = document.querySelector('.dock-item.timer .dock-icon');

  if (startBtn) startBtn.addEventListener('click', startTimer);
  if (pauseBtn) pauseBtn.addEventListener('click', pauseTimer);
  if (resetBtn) resetBtn.addEventListener('click', resetTimer);
  if (resetDockBtn) resetDockBtn.addEventListener('click', resetTimer);
  if (timerIcon) timerIcon.addEventListener('click', () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });
});