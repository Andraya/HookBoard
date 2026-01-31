// Timer functionality
let timerInterval; // To hold the interval ID
let timerSeconds = 0; // Total seconds elapsed
let isRunning = false; // Timer state; in this case, timer starts paused

// Update the timer display
function updateTimerDisplay() {
  const hours = Math.floor(timerSeconds / 3600);
  const minutes = Math.floor((timerSeconds % 3600) / 60);
  const seconds = timerSeconds % 60;
  const display = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`; // Format as HH:MM:SS; thats what padStart does (eg, 5 becomes 05)
  document.getElementById('timerDisplay').textContent = display; // Update main timer display
  }

function startTimer() { // Function to start the timer
  if (!isRunning) { // Only start if not already running
    isRunning = true;
    timerInterval = setInterval(() => { // Increment every second
      timerSeconds++;
      updateTimerDisplay(); // Update display each second
    }, 1000); // 1000 milliseconds = 1 second
  }
}

function pauseTimer() { // Function to pause the timer
  if (isRunning) { // Only pause if currently running
    isRunning = false;
    clearInterval(timerInterval); // Stop the interval
  }
}

function resetTimer() { // Function to reset the timer
  pauseTimer(); // Pause the timer first
  timerSeconds = 0; // Reset seconds to zero
  updateTimerDisplay();   // Update display to show 00:00:00
}

// Load pins dynamically
async function loadPins() { //async function to load pins from JSON without reloading the page; this function is called on page load and after edits/deletions
  try {
    const response = await fetch('/data/pins.json'); // await fetch to get pins.json; 
    if (!response.ok) throw new Error('Failed to load pins.json'); // Error handling
    const pins = await response.json(); // Parse JSON data
    const main = document.querySelector('.masonry-grid'); // Select the main container
    main.innerHTML = ''; // Clear existing hard-coded cards
    pins.forEach(pin => { // Loop through each pin and create card elements
      const cardLink = document.createElement('a'); // Create link element
      cardLink.href = 'details.html'; // Link to details page
      cardLink.className = 'card-link'; // Add class for styling; 
      
      const article = document.createElement('article'); // Create article element
      article.className = 'card'; 
      
      // Image wrapper
      const imgWrapper = document.createElement('div'); // Create image wrapper div
      imgWrapper.className = 'card-image-wrapper'; 
      const img = document.createElement('img'); // Create image element
      img.src = pin.image; // Set image source
      img.alt = pin.title; // Set alt text
      img.className = 'card-image'; 
      img.loading = 'lazy'; // Lazy loading for performance
      imgWrapper.appendChild(img); // Append image to wrapper
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
      content.appendChild(tagsDiv); // Append tags to content
      
      // Buttons
      const buttonsDiv = document.createElement('div');
      buttonsDiv.className = 'card-buttons';
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Editar';
      editBtn.className = 'btn-edit';
      editBtn.onclick = (e) => {
        e.preventDefault();
        // Populate modal
        document.getElementById('editPinId').value = pin.id;
        document.getElementById('editTitle').value = pin.title;
        document.getElementById('editTags').value = pin.tags.join(', ');
        document.getElementById('editDifficulty').value = pin.difficulty || '';
        document.getElementById('editTime').value = pin.time || '';
        document.getElementById('editProductionCost').value = pin.productionCost || '';
        document.getElementById('editUsedMaterials').value = pin.usedMaterials.join(', ');
        // Show modal
        document.getElementById('editModal').style.display = 'block'; // Show modal, style display block: makes it visible
      };
      buttonsDiv.appendChild(editBtn);
      
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Apagar';
      deleteBtn.className = 'btn-delete';
      deleteBtn.onclick = async (e) => {
        e.preventDefault();
        if (confirm('Tem certeza que quer apagar este pin?')) { // Confirmation dialog
          await fetch(`/delete_pin/${pin.id}`, { method: 'POST' }); // Send delete request
          loadPins(); // Reload pins
        }
      };
      buttonsDiv.appendChild(deleteBtn); // Append delete button
      content.appendChild(buttonsDiv); // Append buttons to content
      
      article.appendChild(content);
      cardLink.appendChild(article);
      main.appendChild(cardLink);
    });
  } catch (error) { // Error handling
    console.error('Error loading pins:', error);
    const main = document.querySelector('.masonry-grid');
    main.innerHTML = '<p>Erro ao carregar pins.</p>';
  }
}

// Event listeners for timer buttons
document.addEventListener('DOMContentLoaded', () => { // Ensure DOM is loaded before attaching event listeners; DOM is Document Object Model
  //querySelector selects the first element that matches the CSS selector
  const startBtn = document.querySelector('.btn-start');
  const pauseBtn = document.querySelector('.btn-pause');
  const resetBtn = document.querySelector('.btn-reset');
  const resetDockBtn = document.querySelector('.btn-reset-dock');
  const timerIcon = document.querySelector('.dock-item.timer .dock-icon');
// Add event listeners if elements exist, in this case to the timer buttons
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
  loadPins(); // Call loadPins to fetch and display pins

  // Modal
  const modal = document.getElementById('editModal');
  const closeBtn = document.getElementsByClassName('close')[0];

  if (closeBtn) { // Close modal on close button click only
    closeBtn.onclick = () => {
      modal.style.display = 'none';
    };
  }

  // Edit form submit
  const editForm = document.getElementById('editForm');
  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const pinId = formData.get('pinId');
      const response = await fetch(`/edit_pin/${pinId}`, {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        modal.style.display = 'none';
        loadPins(); // Reload
      }
    });
  }
});