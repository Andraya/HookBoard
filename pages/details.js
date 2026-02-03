/**
 * Details Page - Loads pin data and displays project details
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Get pin ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const pinId = urlParams.get('id');

  if (!pinId) {
    console.error('No pin ID provided');
    return;
  }

  try {
    // Load pins data
    const pinsResponse = await fetch('../data/pins.json');
    const pins = await pinsResponse.json();
    
    // Find the specific pin
    const pin = pins.find(p => p.id == pinId);
    
    if (!pin) {
      console.error('Pin not found');
      return;
    }

    // Load and display PDF
    const pdfViewer = document.getElementById('pdf-viewer');
    if (pdfViewer && pin.pdf) {
      pdfViewer.src = `../${pin.pdf}`;
    }

    // Update page title
    document.title = `${pin.title} - HookBoard`;

    // Update project title
    const projectTitle = document.querySelector('.project-title');
    if (projectTitle) {
      projectTitle.textContent = pin.title;
    }

    // Update tags
    const projectTags = document.querySelector('.project-tags');
    if (projectTags && pin.tags && pin.tags.length > 0) {
      projectTags.innerHTML = pin.tags
        .map(tag => `<span class="tag">${tag}</span>`)
        .join('');
    }

    // Update materials (if available in pin data)
    if (pin.usedMaterials && pin.usedMaterials.length > 0) {
      const materialsList = document.querySelector('.materials-list');
      if (materialsList) {
        materialsList.innerHTML = pin.usedMaterials
          .map((material, index) => 
            `<div class="material-item">${material}</div>${index < pin.usedMaterials.length - 1 ? '<hr class="item-divider">' : ''}`
          )
          .join('');
      }
    }

    // Load financial data from calculator if product exists
    if (pin.productName) {
      try {
        const calculatorResponse = await fetch('../data/calculator.json');
        const products = await calculatorResponse.json();
        
        // Find all products with the same name and get aggregated data
        const matchingProducts = products.filter(p => p.name === pin.productName);
        
        // Format currency helper
        const formatCurrency = (value) => {
          if (typeof value === 'number') {
            return value.toFixed(2);
          }
          return '0.00';
        };
        
        // Update costs section
        const costsList = document.querySelector('.costs-list');
        if (costsList) {
          let materialsValue = '0.00';
          let laborValue = '0.00';
          let totalCost = '0.00';
          
          if (matchingProducts.length > 0) {
            const product = matchingProducts[0];
            materialsValue = formatCurrency(product.totalNormal || 0);
            laborValue = formatCurrency(product.laborCost || 0);
            totalCost = formatCurrency((product.totalNormal || 0) + (product.laborCost || 0));
          }
          
          costsList.innerHTML = `
            <div class="cost-item">
              <span class="cost-name">Materials</span>
              <span class="cost-value">€${materialsValue}</span>
            </div>
            <div class="cost-item">
              <span class="cost-name">Labor</span>
              <span class="cost-value">€${laborValue}</span>
            </div>
            <hr class="total-divider">
            <div class="cost-item total">
              <span class="cost-name">Total Cost</span>
              <span class="cost-value">€${totalCost}</span>
            </div>
          `;
        }
        
        // Update selling price section
        const sellingPriceSection = document.querySelector('.selling-price-section');
        if (sellingPriceSection) {
          let salePrice = '0.00';
          let profit = '0.00';
          let profitPercentage = 0;
          
          if (matchingProducts.length > 0) {
            const product = matchingProducts[0];
            salePrice = formatCurrency(product.salePrice || 0);
            profit = formatCurrency(product.profitNormal || 0);
            const totalCost = product.totalNormal + product.laborCost;
            profitPercentage = totalCost > 0 ? Math.round((parseFloat(profit) / totalCost) * 100) : 0;
          }
          
          sellingPriceSection.innerHTML = `
            <div class="selling-price" style="cursor: pointer;">
              <span class="currency">€</span>
              <span class="price">${salePrice}</span>
            </div>
            <p class="profit-text">Profit: €${profit} (${profitPercentage}%)</p>
          `;
          
          // Add click event to selling price to navigate to calculator with product filter
          const sellingPrice = sellingPriceSection.querySelector('.selling-price');
          if (sellingPrice && pin.productName) {
            sellingPrice.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = `calculator.html?productName=${encodeURIComponent(pin.productName)}&pinId=${pin.id}`;
            });
          }
        }
      } catch (error) {
        console.error('Error loading calculator data:', error);
      }
    } else {
      // No product name, show zeros
      const costsList = document.querySelector('.costs-list');
      if (costsList) {
        costsList.innerHTML = `
          <div class="cost-item">
            <span class="cost-name">Materials</span>
            <span class="cost-value">€0.00</span>
          </div>
          <div class="cost-item">
            <span class="cost-name">Labor</span>
            <span class="cost-value">€0.00</span>
          </div>
          <hr class="total-divider">
          <div class="cost-item total">
            <span class="cost-name">Total Cost</span>
            <span class="cost-value">€0.00</span>
          </div>
        `;
      }
      
      const sellingPriceSection = document.querySelector('.selling-price-section');
      if (sellingPriceSection) {
        sellingPriceSection.innerHTML = `
          <div class="selling-price">
            <span class="currency">€</span>
            <span class="price">0.00</span>
          </div>
          <p class="profit-text">Profit: €0.00 (0%)</p>
        `;
      }
    }

    // Update time information
    if (pin.time) {
      console.log('Time:', pin.time);
    }

  } catch (error) {
    console.error('Error loading pin details:', error);
  }
});
