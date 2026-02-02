
// Event listeners for timer buttons
document.addEventListener('DOMContentLoaded', () => { // Ensure DOM is loaded before attaching event listeners; DOM is Document Object Model
  // Initialize timer using the module
  import('../modules/timer.js').then(({ Timer, initializeTimer }) => {
    const timer = new Timer();
    initializeTimer(timer);
  }).catch(error => console.error('Error loading timer module:', error));

  // Initialize pins functionality
  import('../modules/pins.js').then(({ renderPins, initializePinEditForm }) => {
    import('../modules/api.js').then(async (api) => {
      try {
        const pins = await api.loadPins();
        renderPins(pins);
      } catch (error) {
        console.error('Error loading pins:', error);
        const main = document.querySelector('.masonry-grid');
        if (main) main.innerHTML = '<p>Erro ao carregar pins.</p>';
      }
      initializePinEditForm();
    }).catch(error => console.error('Error loading api module:', error));
  }).catch(error => console.error('Error loading pins module:', error));
});

