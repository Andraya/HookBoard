
// Event listeners for timer buttons
document.addEventListener('DOMContentLoaded', () => { // Ensure DOM is loaded before attaching event listeners; DOM is Document Object Model
  // Initialize timer using the module
  import('../modules/timer.js').then(({ Timer, initializeTimer }) => {
    const timer = new Timer();
    initializeTimer(timer);
  }).catch(error => console.error('Error loading timer module:', error));

  // Initialize pins functionality
  import('../modules/pins.js').then(({ renderPins, sortPins, renderCardsView, initializePinEditForm, getUniqueTags }) => {
    import('../modules/api.js').then(async (api) => {
      try {
        const pins = await api.loadPins();

        // Extract unique tags from pins
        const uniqueTags = [...new Set(pins.flatMap(pin => pin.tags || []))].sort();
        let colorMap = {};
        if (uniqueTags.length > 0) {
          const { generateColorsForTags } = await import('../modules/helper.js');
          colorMap = generateColorsForTags(uniqueTags);
        }

        renderPins(pins, colorMap);

        // Generate dynamic nav tags
        const navTagsContainer = document.getElementById('nav-tags');
        if (navTagsContainer) {
          uniqueTags.forEach(tag => {
            const bgColor = colorMap[tag];
            const tagLink = document.createElement('a');
            tagLink.href = `#category-${tag}`;
            tagLink.className = 'nav-tag';
            tagLink.style.backgroundColor = bgColor;
            tagLink.style.color = '#333';
            tagLink.textContent = tag;
            navTagsContainer.appendChild(tagLink);
          });
        }

        // Add sorting functionality
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
          sortSelect.addEventListener('change', () => {
            const sortedPins = sortPins(sortSelect.value);
            renderCardsView(sortedPins, colorMap);
          });
        }

        // Add toggle functionality for sort options
        const sortToggleBtn = document.getElementById('sort-toggle-btn');
        const sortContainer = document.getElementById('sort-container');
        if (sortToggleBtn && sortContainer) {
          sortToggleBtn.addEventListener('click', () => {
            const isVisible = sortContainer.style.display !== 'none';
            sortContainer.style.display = isVisible ? 'none' : 'block';
            sortToggleBtn.innerHTML = isVisible ? '<i class="fa-solid fa-up-down"></i>' : '<i class="fa-solid fa-xmark"></i>';
          });
        }
      } catch (error) {
        console.error('Error loading pins:', error);
        const main = document.querySelector('.masonry-grid');
        if (main) main.innerHTML = '<p>Erro ao carregar pins.</p>';
      }
      initializePinEditForm();
    }).catch(error => console.error('Error loading api module:', error));
  }).catch(error => console.error('Error loading pins module:', error));
});

