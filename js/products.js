// Product rendering and management

let allProducts = [];
let expandedCard = null;

// Sample fallback products (used if Google Sheets fails to load)
const FALLBACK_PRODUCTS = [
    {
        name: 'Bahtinov Mask 72ED',
        description: 'Precision-engineered Bahtinov mask for perfect focus on your Sky-Watcher 72ED refractor. The diffraction pattern is crystal clear and helps achieve perfect focus in seconds.',
        tags: ['Sky-Watcher', '72ED', 'EQ5'],
        price: '€12.99',
        imageUrl: 'assets/images/bahtinov.png',
        etsy: 'https://www.etsy.com',
        stl: '#'
    },
    {
        name: 'Dust Cap Set',
        description: 'Universal dust caps for eyepieces and accessories. Keeps your optical surfaces clean and protected. Includes both 1.25" and 2" sizes.',
        tags: ['Universal', '1.25"', '2"'],
        price: '€8.50',
        imageUrl: 'assets/images/cap.png',
        etsy: 'https://www.etsy.com',
        stl: '#'
    },
    {
        name: 'Cable Organizer Pro',
        description: 'Keep your mount cables organized and protected. Flexible design works with most mounts. Prevents tangling and cable damage during setup.',
        tags: ['Mount', 'Universal'],
        price: '€5.99',
        imageUrl: 'assets/images/mount.png',
        etsy: 'https://www.etsy.com',
        stl: '#'
    }
];

// Initialize products on page load
async function initializeProducts() {
    // Try to load from Google Sheets
    const sheetsProducts = await fetchProductsFromSheets();
    
    if (sheetsProducts.length > 0) {
        allProducts = sheetsProducts;
    } else {
        allProducts = FALLBACK_PRODUCTS;
    }
    
    renderProducts();
}

// Render products to the DOM
function renderProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    allProducts.forEach((product, index) => {
        const card = createProductCard(product, index);
        productGrid.appendChild(card);
    });
    
    // Add event listeners to all product cards
    attachProductCardListeners();
}

// Create a product card element
function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productIndex = index;
    
    const tagsHTML = product.tags
        .map(tag => `<span class="tag">${tag}</span>`)
        .join('');
    
    card.innerHTML = `
        <button class="close-btn" aria-label="Close">
            <i class="fas fa-times"></i>
        </button>
        <div class="product-img">
            <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <div class="product-tags">
                ${tagsHTML}
            </div>
            <span class="price">${product.price}</span>
            <div class="product-description">
                ${product.description}
            </div>
            <div class="product-actions">
                <a href="${product.stl}" class="btn btn-ghost btn-sm" target="_blank" rel="noopener">
                    <i class="fas fa-download"></i> STL
                </a>
                <a href="${product.etsy}" class="btn btn-primary btn-sm" target="_blank" rel="noopener">
                    <i class="fab fa-etsy"></i> Buy
                </a>
            </div>
        </div>
    `;
    
    return card;
}

// Attach click listeners to product cards
function attachProductCardListeners() {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        // Expand on card click
        card.addEventListener('click', (e) => {
            // Don't expand if clicking on buttons or links
            if (e.target.closest('.btn') || e.target.closest('a')) {
                return;
            }
            expandCard(card);
        });
    });
}

// Expand a product card via modal
function expandCard(card) {
    const index = card.dataset.productIndex;
    if (index === undefined) return;
    
    const product = allProducts[index];
    if (!product) return;
    
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'product-modal-overlay';
    modal.id = 'product-modal';
    
    const tagsHTML = product.tags
        .map(tag => `<span class="tag">${tag}</span>`)
        .join('');
    
    modal.innerHTML = `
        <div class="product-modal-content">
            <button class="close-btn" aria-label="Close" id="modal-close-btn">
                <i class="fas fa-times"></i>
            </button>
            <div class="product-img">
                <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-tags">
                    ${tagsHTML}
                </div>
                <span class="price">${product.price}</span>
                <div class="product-description">
                    ${product.description}
                </div>
                <div class="product-actions">
                    <a href="${product.stl}" class="btn btn-ghost btn-sm" target="_blank" rel="noopener">
                        <i class="fas fa-download"></i> STL
                    </a>
                    <a href="${product.etsy}" class="btn btn-primary btn-sm" target="_blank" rel="noopener">
                        <i class="fab fa-etsy"></i> Buy
                    </a>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    expandedCard = modal;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Event listeners for closing
    modal.querySelector('#modal-close-btn').addEventListener('click', () => collapseCard());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            collapseCard();
        }
    });
    document.addEventListener('keydown', closeOnEscape);
}

// Collapse the product modal
function collapseCard() {
    if (expandedCard && expandedCard.parentNode) {
        expandedCard.classList.add('closing');
        
        // Wait for animation before removing
        setTimeout(() => {
            if (expandedCard && expandedCard.parentNode) {
                expandedCard.parentNode.removeChild(expandedCard);
            }
            expandedCard = null;
            
            // Re-enable body scroll
            document.body.style.overflow = 'auto';
            
            // Remove escape listener
            document.removeEventListener('keydown', closeOnEscape);
        }, 300); // Matches the exit animation duration
    }
}

// Close card on Escape key
function closeOnEscape(e) {
    if (e.key === 'Escape') {
        collapseCard();
    }
}

// Update products from Google Sheets (can be called manually)
async function updateProductsFromSheets() {
    const sheetsProducts = await fetchProductsFromSheets();
    if (sheetsProducts.length > 0) {
        allProducts = sheetsProducts;
        renderProducts();
        console.log('Products updated from Google Sheets');
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeProducts,
        updateProductsFromSheets,
        allProducts
    };
}
