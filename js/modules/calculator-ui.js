import * as calculator from './calculator.js';
import * as dom from './dom.js';

// State management
export const appState = {
    products: [],
    currentExtras: []
};

// Initialize app
export function init() {
    setupEventListeners();
    setupFilterListeners();
    loadProducts();
    renderExtrasDropdown();
    
    // Check if coming from a pin with productName parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('productName');
    const pinId = urlParams.get('pinId');
    
    if (productName && pinId) {
        // Store these for later use
        window.currentProductName = productName;
        window.currentPinId = parseInt(pinId);
    }
}

function setupFilterListeners() {
    // Add filter event listeners
    document.getElementById('filterProduct').addEventListener('input', applyFilters);
    document.getElementById('filterColor').addEventListener('change', applyFilters);
    document.getElementById('filterYarn').addEventListener('change', applyFilters);
    document.getElementById('filterHook').addEventListener('change', applyFilters);
    document.getElementById('filterStock').addEventListener('change', applyFilters);
    document.getElementById('btnResetFilters').addEventListener('click', resetFilters);
}

function setupEventListeners() {
    // Form toggle
    document.getElementById('btnToggleForm').addEventListener('click', toggleFormSection);
    document.getElementById('btnCloseForm').addEventListener('click', toggleFormSection);
    document.getElementById('modalBackdrop').addEventListener('click', toggleFormSection);

    // Calculation triggers
    document.querySelectorAll('[data-input]').forEach(el => {
        el.addEventListener('change', recalculate);
        el.addEventListener('input', recalculate);
    });

    // Markup buttons
    document.querySelectorAll('.markup-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const markup = parseFloat(btn.dataset.markup);
            applySalePrice(markup);
        });
    });

    // Action buttons
    document.getElementById('btnAddExtra').addEventListener('click', addExtra);
    document.getElementById('btnSave').addEventListener('click', saveProduct);

    // Event listeners for colours
    document.getElementById('btnAddColor').addEventListener('click', () => {
        const colorInput = document.getElementById('productColor');
        addColorToList(colorInput.value);
        colorInput.value = '';
        colorInput.focus();
    });

    document.getElementById('productColor').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addColorToList(document.getElementById('productColor').value);
            document.getElementById('productColor').value = '';
        }
    });
}

function toggleFormSection() {
    const formSection = document.getElementById('formSection');
    const backdrop = document.getElementById('modalBackdrop');
    const isOpen = formSection.classList.contains('active');
    
    if (isOpen) {
        formSection.classList.remove('active');
        backdrop.classList.remove('active');
    } else {
        formSection.classList.add('active');
        backdrop.classList.add('active');
    }
}

function renderExtrasDropdown() {
    const extras = calculator.getAllExtras();
    return extras.map(e => `<option value="${e.price}">${e.name}</option>`).join('');
}

function addExtra() {
    const container = document.getElementById('extrasContainer');
    const div = document.createElement('div');
    div.className = 'extra-item';
    div.innerHTML = `
        <select class="extra-select form-input" onchange="window.appState.extras = []; window.recalculate()">
            ${renderExtrasDropdown()}
        </select>
        <input type="number" class="extra-qty form-input" value="1" min="1" onchange="window.recalculate()">
        <button class="btn-remove" onclick="this.parentElement.remove(); window.recalculate()">❌</button>
    `;
    container.appendChild(div);
    recalculate();
}

function getExtrasData() {
    const items = [];
    document.querySelectorAll('.extra-item').forEach(el => {
        const price = parseFloat(el.querySelector('.extra-select').value);
        const qty = parseInt(el.querySelector('.extra-qty').value) || 0;
        if (price && qty > 0) {
            items.push({ price, quantity: qty });
        }
    });
    return items;
}

export function recalculate() {
    const data = {
        totalWeight: parseFloat(document.getElementById('totalWeight').value) || 0,
        yarnWeight: parseFloat(document.getElementById('yarnWeight').value) || 0,
        yarnType: document.getElementById('yarnType').value,
        hours: parseFloat(document.getElementById('hours').value) || 0,
        extras: getExtrasData(),
        salePrice: parseFloat(document.getElementById('salePrice').value) || 0
    };

    const costs = calculator.calculateCosts(data);
    updateCostDisplay(costs);
    updateMarkups(costs.totalNormal);
}

function updateCostDisplay(costs) {
    document.getElementById('yarnCostNormal').textContent = calculator.formatCurrency(costs.yarnCostNormal);
    document.getElementById('yarnCostPromo').textContent = calculator.formatCurrency(costs.yarnCostPromo);
    document.getElementById('fillingCost').textContent = calculator.formatCurrency(costs.fillingCost);
    document.getElementById('laborCost').textContent = calculator.formatCurrency(costs.laborCost);
    document.getElementById('extrasCost').textContent = calculator.formatCurrency(costs.extrasCost);
    document.getElementById('totalNormal').textContent = calculator.formatCurrency(costs.totalNormal);
    document.getElementById('totalPromo').textContent = calculator.formatCurrency(costs.totalPromo);
    
    // Display profit margins as percentages instead of currency
    const profitPercentNormal = calculator.calculateProfitPercentage(costs.profitNormal, costs.salePrice);
    const profitPercentPromo = calculator.calculateProfitPercentage(costs.profitPromo, costs.salePrice);
    document.getElementById('profitNormal').textContent = calculator.formatPercentage(profitPercentNormal);
    document.getElementById('profitPromo').textContent = calculator.formatPercentage(profitPercentPromo);
}

function updateMarkups(baseCost) {
    const markups = calculator.calculateMarkups(baseCost);
    document.getElementById('m10').textContent = calculator.formatCurrency(markups.markup10);
    document.getElementById('m25').textContent = calculator.formatCurrency(markups.markup25);
    document.getElementById('m50').textContent = calculator.formatCurrency(markups.markup50);
    document.getElementById('m100').textContent = calculator.formatCurrency(markups.markup100);
}

function applySalePrice(multiplier) {
    const basePrice = parseFloat(document.getElementById('totalNormal').textContent);
    document.getElementById('salePrice').value = (basePrice * multiplier).toFixed(2);
    recalculate();
}

function findDuplicateProduct(newProduct) {
    // Procura um produto existente com: nome, linha, hook e preço de venda iguais
    // As cores devem ser as mesmas (mesmo que em ordem diferente)
    return appState.products.find(p => {
        const sameColors = Array.isArray(p.color) && Array.isArray(newProduct.color) &&
            p.color.length === newProduct.color.length &&
            p.color.every(c => newProduct.color.includes(c));
        
        return p.name === newProduct.name &&
            p.hook === newProduct.hook &&
            p.yarnType === newProduct.yarnType &&
            p.salePrice === newProduct.salePrice &&
            sameColors;
    });
}

function getColorsList() {
    // Retorna array de cores do appState
    if (!window.appState.colors) {
        window.appState.colors = [];
    }
    return window.appState.colors;
}

export function addColorToList(color) {
    if (!color.trim()) return;
    const colors = getColorsList();
    const normalizedColor = color.trim().toLowerCase();
    // Check if color already exists (case-insensitive)
    const colorExists = colors.some(c => c.toLowerCase() === normalizedColor);
    if (!colorExists) {
        colors.push(normalizedColor);
        renderColorsList();
    }
}

function removeColorFromList(color) {
    const colors = getColorsList();
    const normalizedColor = color.toLowerCase();
    const index = colors.findIndex(c => c.toLowerCase() === normalizedColor);
    if (index > -1) {
        colors.splice(index, 1);
        renderColorsList();
    }
}

function renderColorsList() {
    const colors = getColorsList();
    const container = document.getElementById('colorsList');
    container.innerHTML = colors.map(color => `
        <div class="color-item">
            <span class="color-swatch" style="background-color: ${getColorCode(color)};" title="${color}"></span>
            <span>${color}</span>
            <button type="button" data-remove-color="${color}" class="color-remove-btn" aria-label="Remove ${color}">✕</button>
        </div>
    `).join('');
    
    // Adicionar event listeners aos botões de remover
    document.querySelectorAll('[data-remove-color]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            removeColorFromList(e.target.dataset.removeColor);
        });
    });
}

function mergeProductsInTable(existingProduct, newProduct) {
    // Atualiza a linha existente com novo stock
    const row = document.querySelector(`tr[data-product-id="${existingProduct.id}"]`);
    if (row) {
        const stockCell = row.querySelector('td:nth-child(7)');
        if (stockCell) {
            stockCell.textContent = existingProduct.stock;
        }
    }
    updateFilterOptions();
}

function saveProduct() {
    const name = document.getElementById('productName').value;
    const colors = getColorsList();
    
    if (!name.trim()) {
        alert('Por favor, insira um nome para o produto');
        return;
    }
    
    if (colors.length === 0) {
        alert('Por favor, adicione pelo menos uma cor');
        return;
    }

    const newProduct = calculator.createProductRecord({
        name: document.getElementById('productName').value,
        color: colors,
        hook: document.getElementById('hook').value,
        yarnType: document.getElementById('yarnType').value,
        totalWeight: parseFloat(document.getElementById('totalWeight').value) || 0,
        yarnWeight: parseFloat(document.getElementById('yarnWeight').value) || 0,
        hours: parseFloat(document.getElementById('hours').value) || 0,
        extras: getExtrasData(),
        salePrice: parseFloat(document.getElementById('salePrice').value) || 0,
        stock: 1
    });

    // Check if there's a matching pin
    fetch('../data/pins.json')
        .then(r => r.json())
        .then(pins => {
            const matchingPin = pins.find(p => p.productName === name);
            if (matchingPin) {
                newProduct.pinId = matchingPin.id;
            }
        })
        .catch(error => console.error('Error checking pins:', error));

    // Verify for duplicates
    const duplicateProduct = findDuplicateProduct(newProduct);
    
    if (duplicateProduct) {
        // Duplicate product found - increase stock
        duplicateProduct.stock += 1;
        mergeProductsInTable(duplicateProduct, newProduct);
    } else {
        // New product - add to list
        appState.products.push(newProduct);
        addProductToTable(newProduct);
    }

    persistProducts();
    clearForm();
    toggleFormSection();
}

function groupProductsByKey() {
    // Group products by (name, yarnType, salePrice)
    const groups = {};
    appState.products.forEach(product => {
        const key = `${product.name}|${product.yarnType}|${product.salePrice}`;
        if (!groups[key]) {
            groups[key] = {
                name: product.name,
                yarnType: product.yarnType,
                salePrice: product.salePrice,
                totalNormal: product.totalNormal,
                totalPromo: product.totalPromo,
                profitNormal: product.profitNormal,
                profitPromo: product.profitPromo,
                variants: []
            };
        }
        groups[key].variants.push({
            id: product.id,
            color: Array.isArray(product.color) ? product.color : [product.color],
            hook: product.hook,
            stock: product.stock
        });
    });
    return Object.values(groups);
}

function renderProductsTable() {
    const tbody = document.querySelector('#productsTable tbody');
    tbody.innerHTML = '';
    
    const groups = groupProductsByKey();
    const yarnTypes = calculator.getAllYarnTypes();
    
    groups.forEach(group => {
        const yarnName = yarnTypes[group.yarnType]?.name || group.yarnType;
        const totalStock = group.variants.reduce((sum, v) => sum + v.stock, 0);
        
        // Gather all unique colours
        const allColours = new Set();
        const variantDetails = [];
        
        group.variants.forEach(variant => {
            variant.color.forEach(c => allColours.add(c));
            variantDetails.push({
                colors: variant.color.join(', '),
                hook: variant.hook,
                stock: variant.stock,
                id: variant.id
            });
        });
        
        const tr = document.createElement('tr');
        tr.dataset.groupKey = `${group.name}|${group.yarnType}|${group.salePrice}`;
        tr.dataset.yarnType = group.yarnType;
        
        // Render unique colours as badges
        const colourBadgesHTML = [...allColours].sort().map(colour => {
            const bgColor = getColorCode(colour);
            const textColor = getTextColorForBackground(bgColor);
            return `<span class="color-badge" style="background-color: ${bgColor}; color: ${textColor};" title="${colour}">${colour}</span>`;
        }).join('');

        // Render variants details with individual stock controls
        const variantsHTML = variantDetails.map(v => {
            // Convert colours to badges
            const colourBadges = v.colors.split(', ').map(colour => {
                const bgColor = getColorCode(colour);
                const textColor = getTextColorForBackground(bgColor);
                return `<span class="color-badge" style="background-color: ${bgColor}; color: ${textColor};" title="${colour}">${colour}</span>`;
            }).join(' ');
            
            return `<div class="variant-row">
                <span class="variant-info">
                    ${colourBadges} | <span class="hook-badge" style="background-color: ${getHookColor(v.hook)}; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold; font-size: 0.8rem;">${v.hook}</span> <span class="variant-stock">(${v.stock})</span>
                </span>
                <span class="variant-controls">
                    <button class="btn-variant-add" data-variant-id="${v.id}">+</button>
                    <button class="btn-variant-remove" data-variant-id="${v.id}">-</button>
                </span>
            </div>`;
        }).join('');
        
        tr.innerHTML = `
            <td class="product-name-cell"><b style="cursor: pointer;" data-group-key="${tr.dataset.groupKey}">${group.name}</b></td>
            <td><small>${yarnName}</small></td>
            <td>
                <div class="variants-container">
                    ${variantsHTML}
                </div>
            </td>
            <td>
                <div class="production-cost">
                    <span class="cost-normal" title="Custo Normal">
                        N: ${calculator.formatCurrency(group.totalNormal)}; P: ${calculator.formatCurrency(group.totalPromo)}
                    </span>
                </div>
            </td>
            <td>
                <div class="sale-info">
                    <div class="sale-price">€ ${calculator.formatCurrency(group.salePrice)}</div>
                    <div class="profit-info" title="Profit Margin % Normal / Promo">
                        N: ${calculator.formatPercentage(calculator.calculateProfitPercentage(group.profitNormal, group.salePrice))}; P: ${calculator.formatPercentage(calculator.calculateProfitPercentage(group.profitPromo, group.salePrice))}
                    </div>
            </td>
            <td class="text-center" style="font-weight: 600; font-size: 1.1em;">${totalStock}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-duplicate" title="Duplicar produto">📋</button>
                    <button class="btn-action btn-delete" title="Apagar produto">🗑️</button>
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
        
        // Add click event to product name to navigate to corresponding pin
        const productNameCell = tr.querySelector('.product-name-cell b');
        if (productNameCell) {
            productNameCell.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Find the first variant's product to get its pinId
                const firstVariant = group.variants[0];
                const product = appState.products.find(p => p.id === firstVariant.id);
                if (product && product.pinId) {
                    window.location.href = `../pages/details.html?id=${product.pinId}`;
                }
            });
        }
        
        // Event listeners para botões de variantes individuais
        tr.querySelectorAll('.btn-variant-add').forEach(btn => {
            btn.addEventListener('click', () => {
                const variantId = parseInt(btn.dataset.variantId);
                updateVariantStock(variantId, 'add');
            });
        });
        
        tr.querySelectorAll('.btn-variant-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const variantId = parseInt(btn.dataset.variantId);
                updateVariantStock(variantId, 'remove');
            });
        });
        
        tr.querySelector('.btn-delete').addEventListener('click', () => {
            deleteProductGroup(group);
        });
        
        tr.querySelector('.btn-duplicate').addEventListener('click', () => {
            duplicateProductGroup(group);
        });
    });
    
    updateFilterOptions();
    applyFilters();
}

function addProductToTable(product) {
    // Render the entire table again with merged products
    renderProductsTable();
}

function duplicateProductGroup(group) {
    // Fill the form with group data for duplication
    const firstVariant = group.variants[0];
    const product = appState.products.find(p => p.id === firstVariant.id);
    
    if (!product) return;
    
    // Fill form fields
    document.getElementById('productName').value = product.name;
    window.appState.colors = [...firstVariant.color];
    renderColorsList();
    document.getElementById('yarnType').value = product.yarnType;
    document.getElementById('hook').value = product.hook;
    document.getElementById('totalWeight').value = product.totalWeight;
    document.getElementById('yarnWeight').value = product.yarnWeight;
    document.getElementById('hours').value = product.hours;
    document.getElementById('salePrice').value = product.salePrice;
    
    // Fill extras if they exist
    const extrasContainer = document.getElementById('extrasContainer');
    extrasContainer.innerHTML = '';
    if (product.extras && product.extras.length > 0) {
        product.extras.forEach(extra => {
            addExtraRow(extra.price, extra.quantity);
        });
    }
    
    // Recalculate costs
    recalculate();
    
    // Open the form to edit data
    toggleFormSection();
}

function updateVariantStock(variantId, action) {
    // Increase/decrease stock of a specific variant
    const product = appState.products.find(p => p.id === variantId);
    if (!product) return;
    
    if (action === 'add') {
        product.stock++;
    } else if (action === 'remove' && product.stock > 0) {
        product.stock--;
    }
    
    persistProducts();
    renderProductsTable();
}

function updateGroupStock(group, action, row) {
    // Increase/decrease stock of all variants in the group
    group.variants.forEach(variant => {
        const product = appState.products.find(p => p.id === variant.id);
        if (!product) return;
        
        if (action === 'add') {
            product.stock++;
        } else if (action === 'sell' && product.stock > 0) {
            product.stock--;
        }
    });
    
    persistProducts();
    renderProductsTable();
}

function deleteProductGroup(group) {
    if (!confirm('Eliminar este grupo de produtos e todas as suas variantes?')) return;
    // Removel all products in the group
    const productIds = group.variants.map(v => v.id);
    appState.products = appState.products.filter(p => !productIds.includes(p.id));
    persistProducts();
    renderProductsTable();
}

function updateStock(productId, action, row) {
    const product = appState.products.find(p => p.id === productId);
    if (!product) return;

    if (action === 'add') {
        product.stock++;
    } else if (action === 'sell' && product.stock > 0) {
        product.stock--;
    }

    persistProducts();
    renderProductsTable();
}

export function deleteProduct(productId) {
    if (!confirm('Eliminar este produto?')) return;
    appState.products = appState.products.filter(p => p.id !== productId);
    persistProducts();
    renderProductsTable();
}

function getColorCode(colorName) {
    // Simple color mapping, will be connected to a better system later
    const colors = {
        'w': '#ffffff',
        'white': '#ffffff',
        'black': '#000000',
        'red': '#ff4444',
        'blue': '#449bff',
        'dark blue': '#0044cc',
        'green': '#44ff44',
        'yellow': '#ffff44',
        'pink': '#ff99cc',
        'orange': '#ff8844',
        'purple': '#9944ff',
        'beige': '#ccaa88',
        'brown': '#8B4513',
        'gray': '#888888',
        'grey': '#888888'
    };
    return colors[colorName?.toLowerCase()] || '#cccccc';
}

function getTextColorForBackground(hexColor) {
    // Convert hex to RGB
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance using relative luminance formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // If luminance > 0.5, use dark text, otherwise use white
    return luminance > 0.5 ? '#333333' : '#ffffff';
}

function getHookColor(hookSize) {
    // Specific Hooks get specific colors
    const hookColors = {
        '2 mm': '#FF6B6B',      // Vermelho
        '2.5 mm': '#FF8C42',    // Laranja
        '3 mm': '#FFD93D',      // Amarelo
        '3.5 mm': '#6BCB77',    // Verde claro
        '4 mm': '#4D96FF',      // Azul
        '4.5 mm': '#9B59B6',    // Púrpura
        '5 mm': '#E74C3C',      // Vermelho vivo
        '5.5 mm': '#3498DB',    // Azul claro
        '6 mm': '#1ABC9C',      // Turquesa
        '6.5 mm': '#F39C12',    // Ouro
        '7 mm': '#C0392B',      // Vermelho escuro
        '8 mm': '#2C3E50'       // Cinzento escuro
    };
    return hookColors[hookSize] || '#95A5A6'; // Cinzento padrão
}

function updateFilterOptions() {
    // Get unique colors and yarn types
    const allColors = [];
    const allHooks = [];
    appState.products.forEach(p => {
        const colors = Array.isArray(p.color) ? p.color : [p.color];
        allColors.push(...colors);
        allHooks.push(p.hook);
    });
    // Normalize colors to lowercase and remove duplicates
    const normalizedColors = allColors.map(c => c.toLowerCase());
    const uniqueColors = [...new Set(normalizedColors)].sort();
    const uniqueHooks = [...new Set(allHooks)].sort();
    const yarnTypes = calculator.getAllYarnTypes();
    const yarns = [...new Set(appState.products.map(p => p.yarnType))].sort();

    // Update color filter
    const colorFilter = document.getElementById('filterColor');
    const selectedColor = colorFilter.value;
    colorFilter.innerHTML = '<option value="">All</option>';
    uniqueColors.forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = color;
        colorFilter.appendChild(option);
    });
    colorFilter.value = selectedColor;

    // Update yarn filter
    const yarnFilter = document.getElementById('filterYarn');
    const selectedYarn = yarnFilter.value;
    yarnFilter.innerHTML = '<option value="">All</option>';
    yarns.forEach(yarn => {
        const option = document.createElement('option');
        option.value = yarn;
        option.textContent = yarnTypes[yarn]?.name || yarn;
        yarnFilter.appendChild(option);
    });
    yarnFilter.value = selectedYarn;

    // Update hook filter
    const hookFilter = document.getElementById('filterHook');
    const selectedHook = hookFilter.value;
    hookFilter.innerHTML = '<option value="">All</option>';
    uniqueHooks.forEach(hook => {
        const option = document.createElement('option');
        option.value = hook;
        option.textContent = hook;
        hookFilter.appendChild(option);
    });
    hookFilter.value = selectedHook;
}

function applyFilters() {
    const productFilter = document.getElementById('filterProduct').value.toLowerCase();
    const colorFilter = document.getElementById('filterColor').value.toLowerCase();
    const yarnFilter = document.getElementById('filterYarn').value;
    const hookFilter = document.getElementById('filterHook').value;
    const stockFilter = document.getElementById('filterStock').value;

    const rows = document.querySelectorAll('#productsTable tbody tr');
    rows.forEach(row => {
        const productName = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
        const yarnType = row.dataset.yarnType;
        const variantsText = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
        const stock = parseInt(row.querySelector('td:nth-child(6)').textContent);
        
        // For colors, verify if any variant has the selected color
        let colorMatches = true;
        if (colorFilter) {
            colorMatches = variantsText.includes(colorFilter);
        }
        
        // For hooks, verify if any variant has the selected hook
        let hookMatches = true;
        if (hookFilter) {
            hookMatches = variantsText.includes(hookFilter);
        }

        let visible = true;

        // Apply product filter
        if (productFilter && !productName.includes(productFilter)) visible = false;

        // Apply color filter - verify if the selected color is present
        if (!colorMatches) visible = false;

        // Apply yarn filter - compare with the data attribute
        if (yarnFilter && yarnType !== yarnFilter) visible = false;

        // Apply hook filter - verify in the variants
        if (!hookMatches) visible = false;

        // Apply stock filter
        if (stockFilter === '0' && stock !== 0) visible = false;
        if (stockFilter === '1+' && stock === 0) visible = false;

        row.style.display = visible ? '' : 'none';
    });
}

function resetFilters() {
    document.getElementById('filterProduct').value = '';
    document.getElementById('filterColor').value = '';
    document.getElementById('filterYarn').value = '';
    document.getElementById('filterHook').value = '';
    document.getElementById('filterStock').value = '';
    applyFilters();
}

function persistProducts() {
    calculator.saveProducts(appState.products).catch(error => {
        console.error('Erro ao guardar produtos:', error);
        alert('Erro ao guardar produtos. Verifique a consola.');
    });
}

async function loadProducts() {
    try {
        const products = await calculator.loadProducts();
        if (products && products.length > 0) {
            // Load pins to get mapping of productName to pinId
            const pins = await fetch('/data/pins.json').then(r => r.json());
            
            // Create a map from productName to pinId
            const productNameToPinId = {};
            pins.forEach(pin => {
                if (pin.productName) {
                    productNameToPinId[pin.productName] = pin.id;
                }
            });
            
            // Add pinId to each product
            products.forEach(product => {
                if (productNameToPinId[product.name]) {
                    product.pinId = productNameToPinId[product.name];
                }
            });
            
            appState.products = products;
            // Clear the table before loading, to avoid duplicates
            const tbody = document.querySelector('#productsTable tbody');
            tbody.innerHTML = '';
            // Add products
            products.forEach(product => addProductToTable(product));
            updateFilterOptions();
            
            // Apply filter if coming from a pin
            if (window.currentProductName) {
                const filterInput = document.getElementById('filterProduct');
                if (filterInput) {
                    filterInput.value = window.currentProductName;
                    applyFilters();
                }
            }
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

function clearForm() {
    document.getElementById('productName').value = '';
    document.getElementById('productColor').value = '';
    window.appState.colors = [];
    renderColorsList();
    document.getElementById('totalWeight').value = '0';
    document.getElementById('yarnWeight').value = '0';
    document.getElementById('hours').value = '1';
    document.getElementById('salePrice').value = '0';
    document.getElementById('extrasContainer').innerHTML = '';
    recalculate();
}
