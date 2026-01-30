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

// Load pins dynamically
async function loadPins() {
  try {
    const response = await fetch('./data/pins.json');
    if (!response.ok) throw new Error('Failed to load pins.json');
    const pins = await response.json();
    const main = document.querySelector('.masonry-grid');
    main.innerHTML = ''; // Clear existing hard-coded cards
    pins.forEach(pin => {
      const cardLink = document.createElement('a');
      cardLink.href = 'details.html'; // You can modify to 'details.html?id=' + pin.id if needed
      cardLink.className = 'card-link';
      
      const article = document.createElement('article');
      article.className = 'card';
      
      // Image wrapper
      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'card-image-wrapper';
      const img = document.createElement('img');
      img.src = pin.image;
      img.alt = pin.title;
      img.className = 'card-image';
      img.loading = 'lazy';
      imgWrapper.appendChild(img);
      article.appendChild(imgWrapper);
      
      // Card content
      const content = document.createElement('div');
      content.className = 'card-content';
      
      // Title
      const title = document.createElement('h3');
      title.className = 'card-title';
      title.textContent = pin.title;
      content.appendChild(title);
      
      // Tags
      const tagsDiv = document.createElement('div');
      tagsDiv.className = 'tags';
      pin.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = `tag tag--${tag}`;
        span.textContent = tag;
        tagsDiv.appendChild(span);
      });
      content.appendChild(tagsDiv);
      article.appendChild(content);
      cardLink.appendChild(article);
      main.appendChild(cardLink);
    });
  } catch (error) {
    console.error('Error loading pins:', error);
    const main = document.querySelector('.masonry-grid');
    main.innerHTML = '<p>Erro ao carregar pins.</p>';
  }
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

  // Load pins on page load
  loadPins();
});