// Marketplace JavaScript
class Marketplace {
    constructor() {
        this.allItems = [];
        this.filteredItems = [];
        this.currentCategory = 'all';
        this.currentSort = 'newest';
        this.init();
    }

    init() {
        this.loadItems();
        this.setupEventListeners();
        this.displayItems();
    }

    setupEventListeners() {
        // Search form
        const searchForm = document.getElementById('marketplaceSearchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => this.handleSearch(e));
        }

        // Filter inputs
        const filterInputs = document.querySelectorAll('#marketplaceSearchForm input, #marketplaceSearchForm select');
        filterInputs.forEach(input => {
            input.addEventListener('change', () => this.applyFilters());
            input.addEventListener('input', () => this.applyFilters());
        });
    }

    loadItems() {
        // Load crops
        const crops = DataManager.getCrops().filter(crop => crop.status === 'available');
        const cropItems = crops.map(crop => ({
            ...crop,
            type: 'crop',
            category: 'crops',
            displayName: crop.name,
            displayPrice: crop.price,
            displayUnit: crop.unit,
            displayLocation: crop.location,
            displayQuality: crop.quality,
            displayDescription: crop.description,
            displayImage: crop.image,
            sellerName: crop.farmerName,
            sellerType: 'Farmer'
        }));

        // Load products
        const products = DataManager.getProducts().filter(product => product.status === 'available');
        const productItems = products.map(product => ({
            ...product,
            type: 'product',
            category: 'products',
            displayName: product.name,
            displayPrice: product.price,
            displayUnit: product.unit,
            displayLocation: 'Various Locations',
            displayQuality: product.certification,
            displayDescription: product.description,
            displayImage: product.image,
            sellerName: product.providerName,
            sellerType: 'Service Provider'
        }));

        this.allItems = [...cropItems, ...productItems];
        this.filteredItems = [...this.allItems];
    }

    handleSearch(e) {
        e.preventDefault();
        this.applyFilters();
    }

    applyFilters() {
        const searchTerm = document.getElementById('marketplaceSearch').value.toLowerCase();
        const category = document.getElementById('categoryFilter').value;
        const milletType = document.getElementById('milletTypeFilter').value;
        const location = document.getElementById('locationFilter').value.toLowerCase();
        const quality = document.getElementById('qualityFilter').value;
        const priceMin = parseFloat(document.getElementById('priceMinFilter').value) || 0;
        const priceMax = parseFloat(document.getElementById('priceMaxFilter').value) || Infinity;

        this.filteredItems = this.allItems.filter(item => {
            const matchesSearch = !searchTerm || 
                item.displayName.toLowerCase().includes(searchTerm) ||
                item.displayDescription.toLowerCase().includes(searchTerm) ||
                item.sellerName.toLowerCase().includes(searchTerm);
            
            const matchesCategory = !category || item.category === category;
            const matchesMilletType = !milletType || item.type === milletType;
            const matchesLocation = !location || item.displayLocation.toLowerCase().includes(location);
            const matchesQuality = !quality || item.displayQuality === quality;
            const matchesPrice = item.displayPrice >= priceMin && item.displayPrice <= priceMax;

            return matchesSearch && matchesCategory && matchesMilletType && 
                   matchesLocation && matchesQuality && matchesPrice;
        });

        this.sortItems();
        this.displayItems();
    }

    sortItems() {
        const sortBy = document.getElementById('sortBy').value;
        
        switch (sortBy) {
            case 'newest':
                this.filteredItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'price-low':
                this.filteredItems.sort((a, b) => a.displayPrice - b.displayPrice);
                break;
            case 'price-high':
                this.filteredItems.sort((a, b) => b.displayPrice - a.displayPrice);
                break;
            case 'quantity':
                this.filteredItems.sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
                break;
            case 'name':
                this.filteredItems.sort((a, b) => a.displayName.localeCompare(b.displayName));
                break;
        }
    }

    displayItems() {
        const marketplaceItems = document.getElementById('marketplaceItems');
        
        if (this.filteredItems.length === 0) {
            marketplaceItems.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-search"></i>
                    <p>No items found matching your criteria</p>
                    <button class="btn btn-outline" onclick="clearFilters()">
                        <i class="fas fa-times"></i> Clear Filters
                    </button>
                </div>
            `;
            return;
        }

        marketplaceItems.innerHTML = this.filteredItems.map(item => `
            <div class="marketplace-item" data-item-id="${item.id}">
                <div class="item-image">
                    ${item.displayImage ? 
                        `<img src="${item.displayImage}" alt="${item.displayName}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                        `<i class="fas fa-${item.type === 'crop' ? 'seedling' : 'box'}" style="font-size: 3rem; color: #8B4513;"></i>`
                    }
                </div>
                <div class="item-info">
                    <div class="item-header">
                        <h3 class="item-title">${item.displayName}</h3>
                        <span class="item-category">${item.category}</span>
                    </div>
                    <div class="item-price">
                        <span class="price">${formatPrice(item.displayPrice)}</span>
                        <span class="unit">/${item.displayUnit}</span>
                    </div>
                    <div class="item-details">
                        <div class="item-location">
                            <i class="fas fa-map-marker-alt"></i> ${item.displayLocation}
                        </div>
                        <div class="item-seller">
                            <i class="fas fa-user"></i> ${item.sellerName} (${item.sellerType})
                        </div>
                        <div class="item-quality">
                            <span class="badge badge-${item.displayQuality.toLowerCase().replace(' ', '-')}">${item.displayQuality}</span>
                        </div>
                        ${item.quantity ? `
                            <div class="item-quantity">
                                <strong>Available:</strong> ${item.quantity} ${item.unit}
                            </div>
                        ` : ''}
                    </div>
                    ${item.displayDescription ? `
                        <div class="item-description">${item.displayDescription}</div>
                    ` : ''}
                    <div class="item-actions">
                        <button class="btn btn-primary btn-small" onclick="marketplace.viewItemDetails(${item.id}, '${item.type}')">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="btn btn-outline btn-small" onclick="marketplace.contactSeller(${item.id}, '${item.type}')">
                            <i class="fas fa-phone"></i> Contact
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    viewItemDetails(itemId, itemType) {
        const item = this.filteredItems.find(i => i.id === itemId);
        if (!item) return;

        const details = `
            <div class="item-details-modal">
                <h2>${item.displayName}</h2>
                <div class="detail-section">
                    <h3>Product Information</h3>
                    <p><strong>Type:</strong> ${item.category}</p>
                    <p><strong>Price:</strong> ${formatPrice(item.displayPrice)}/${item.displayUnit}</p>
                    <p><strong>Quality:</strong> ${item.displayQuality}</p>
                    <p><strong>Location:</strong> ${item.displayLocation}</p>
                    ${item.quantity ? `<p><strong>Available Quantity:</strong> ${item.quantity} ${item.unit}</p>` : ''}
                </div>
                <div class="detail-section">
                    <h3>Seller Information</h3>
                    <p><strong>Name:</strong> ${item.sellerName}</p>
                    <p><strong>Type:</strong> ${item.sellerType}</p>
                </div>
                ${item.displayDescription ? `
                    <div class="detail-section">
                        <h3>Description</h3>
                        <p>${item.displayDescription}</p>
                    </div>
                ` : ''}
                <div class="detail-actions">
                    <button class="btn btn-primary" onclick="marketplace.contactSeller(${item.id}, '${item.type}')">
                        <i class="fas fa-phone"></i> Contact Seller
                    </button>
                    <button class="btn btn-outline" onclick="marketplace.addToCart(${item.id}, '${item.type}')">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;

        alert(details);
    }

    contactSeller(itemId, itemType) {
        const item = this.filteredItems.find(i => i.id === itemId);
        if (!item) return;

        showNotification(`Contact request sent to ${item.sellerName}!`, 'success');
    }

    addToCart(itemId, itemType) {
        const item = this.filteredItems.find(i => i.id === itemId);
        if (!item) return;

        // Add to cart (simplified)
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(cartItem => cartItem.id === itemId && cartItem.type === itemType);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: itemId,
                type: itemType,
                name: item.displayName,
                price: item.displayPrice,
                unit: item.displayUnit,
                quantity: 1,
                sellerName: item.sellerName
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        showNotification('Item added to cart!', 'success');
    }
}

// Global functions
function showCategory(category) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter by category
    document.getElementById('categoryFilter').value = category === 'all' ? '' : category;
    if (window.marketplace) {
        window.marketplace.applyFilters();
    }
}

function sortItems() {
    if (window.marketplace) {
        window.marketplace.sortItems();
        window.marketplace.displayItems();
    }
}

function clearFilters() {
    document.getElementById('marketplaceSearchForm').reset();
    if (window.marketplace) {
        window.marketplace.filteredItems = [...window.marketplace.allItems];
        window.marketplace.displayItems();
    }
}

function loadMoreItems() {
    // In a real application, this would load more items from a server
    showNotification('All items are currently displayed', 'info');
}

// Initialize marketplace
document.addEventListener('DOMContentLoaded', function() {
    window.marketplace = new Marketplace();
});
