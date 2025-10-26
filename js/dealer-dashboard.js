// Dealer Dashboard JavaScript
class DealerDashboard {
    constructor() {
        this.currentUser = null;
        this.crops = [];
        this.orders = [];
        this.favoriteFarmers = [];
        this.filteredCrops = [];
        this.init();
    }

    init() {
        // Check if user is logged in and is a dealer
        this.currentUser = DataManager.getCurrentUser();
        if (!this.currentUser || this.currentUser.role !== 'dealer') {
            window.location.href = 'index.html';
            return;
        }

        // Update dealer name
        document.getElementById('dealerName').textContent = this.currentUser.name;

        // Load data
        this.loadCrops();
        this.loadOrders();
        this.loadFavoriteFarmers();
        this.updateStats();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Search form
        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => this.handleSearch(e));
        }

        // Order form
        const orderForm = document.getElementById('orderForm');
        if (orderForm) {
            orderForm.addEventListener('submit', (e) => this.handleOrder(e));
        }

        // Order quantity change
        const orderQuantity = document.getElementById('orderQuantity');
        if (orderQuantity) {
            orderQuantity.addEventListener('input', () => this.updateOrderSummary());
        }
    }

    loadCrops() {
        this.crops = DataManager.getCrops().filter(crop => crop.status === 'available');
        this.filteredCrops = [...this.crops];
        this.displayCrops();
    }

    loadOrders() {
        this.orders = JSON.parse(localStorage.getItem('orders') || '[]')
            .filter(order => order.dealerId === this.currentUser.id);
    }

    loadFavoriteFarmers() {
        this.favoriteFarmers = JSON.parse(localStorage.getItem('favoriteFarmers') || '[]')
            .filter(fav => fav.dealerId === this.currentUser.id);
    }

    displayCrops() {
        const cropsList = document.getElementById('cropsList');
        
        if (this.filteredCrops.length === 0) {
            cropsList.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-seedling"></i>
                    <p>No crops found</p>
                </div>
            `;
            return;
        }

        cropsList.innerHTML = this.filteredCrops.map(crop => `
            <div class="product-card" data-crop-id="${crop.id}">
                <div class="product-image">
                    ${crop.image ? `<img src="${crop.image}" alt="${crop.name}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                      `<i class="fas fa-seedling" style="font-size: 3rem; color: #8B4513;"></i>`}
                </div>
                <div class="product-info">
                    <div class="product-title">${crop.name}</div>
                    <div class="product-price">${formatPrice(crop.price)}/${crop.unit}</div>
                    <div class="product-location">
                        <i class="fas fa-map-marker-alt"></i> ${crop.location}
                    </div>
                    <div class="product-farmer">
                        <i class="fas fa-user"></i> ${crop.farmerName}
                    </div>
                    <div class="product-details">
                        <span class="badge badge-${crop.quality.toLowerCase()}">${crop.quality}</span>
                        <span class="badge badge-${crop.type.replace(' ', '-').toLowerCase()}">${crop.type}</span>
                    </div>
                    <div class="product-quantity">
                        <strong>Available:</strong> ${crop.quantity} ${crop.unit}
                    </div>
                    ${crop.description ? `<div class="product-description">${crop.description}</div>` : ''}
                    <div class="product-actions">
                        <button class="btn btn-primary btn-small" onclick="dealerDashboard.showOrderModal(${crop.id})">
                            <i class="fas fa-shopping-cart"></i> Order
                        </button>
                        <button class="btn btn-outline btn-small" onclick="dealerDashboard.toggleFavorite(${crop.farmerId}, '${crop.farmerName}')">
                            <i class="fas fa-heart"></i> Favorite
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    handleSearch(e) {
        e.preventDefault();
        
        const searchTerm = document.getElementById('searchTerm').value.toLowerCase();
        const milletType = document.getElementById('milletType').value;
        const location = document.getElementById('location').value.toLowerCase();
        const quality = document.getElementById('quality').value;
        const priceMin = parseFloat(document.getElementById('priceMin').value) || 0;
        const priceMax = parseFloat(document.getElementById('priceMax').value) || Infinity;
        const quantityMin = parseFloat(document.getElementById('quantityMin').value) || 0;

        this.filteredCrops = this.crops.filter(crop => {
            const matchesSearch = !searchTerm || 
                crop.name.toLowerCase().includes(searchTerm) ||
                crop.description.toLowerCase().includes(searchTerm);
            
            const matchesType = !milletType || crop.type === milletType;
            const matchesLocation = !location || crop.location.toLowerCase().includes(location);
            const matchesQuality = !quality || crop.quality === quality;
            const matchesPrice = crop.price >= priceMin && crop.price <= priceMax;
            const matchesQuantity = crop.quantity >= quantityMin;

            return matchesSearch && matchesType && matchesLocation && 
                   matchesQuality && matchesPrice && matchesQuantity;
        });

        this.displayCrops();
    }

    showOrderModal(cropId) {
        const crop = this.crops.find(c => c.id === cropId);
        if (!crop) return;

        document.getElementById('orderCropId').value = cropId;
        document.getElementById('orderQuantity').max = crop.quantity;
        document.getElementById('orderQuantity').value = 1;
        document.getElementById('orderMessage').value = '';
        
        this.updateOrderSummary();
        document.getElementById('orderModal').style.display = 'block';
    }

    updateOrderSummary() {
        const cropId = parseInt(document.getElementById('orderCropId').value);
        const quantity = parseInt(document.getElementById('orderQuantity').value) || 0;
        const crop = this.crops.find(c => c.id === cropId);
        
        if (!crop) return;

        const totalPrice = crop.price * quantity;
        const orderSummary = document.getElementById('orderSummary');
        
        orderSummary.innerHTML = `
            <div class="order-details">
                <p><strong>Crop:</strong> ${crop.name}</p>
                <p><strong>Farmer:</strong> ${crop.farmerName}</p>
                <p><strong>Price per ${crop.unit}:</strong> ${formatPrice(crop.price)}</p>
                <p><strong>Quantity:</strong> ${quantity} ${crop.unit}</p>
                <p><strong>Total Price:</strong> ${formatPrice(totalPrice)}</p>
            </div>
        `;
    }

    handleOrder(e) {
        e.preventDefault();
        
        const cropId = parseInt(document.getElementById('orderCropId').value);
        const quantity = parseInt(document.getElementById('orderQuantity').value);
        const message = document.getElementById('orderMessage').value;
        
        const crop = this.crops.find(c => c.id === cropId);
        if (!crop) return;

        // Create order
        const order = {
            id: Date.now(),
            dealerId: this.currentUser.id,
            dealerName: this.currentUser.name,
            cropId: cropId,
            cropName: crop.name,
            farmerId: crop.farmerId,
            farmerName: crop.farmerName,
            quantity: quantity,
            unit: crop.unit,
            pricePerUnit: crop.price,
            totalPrice: crop.price * quantity,
            message: message,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // Save order
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Update crop quantity
        const allCrops = DataManager.getCrops();
        const cropIndex = allCrops.findIndex(c => c.id === cropId);
        if (cropIndex !== -1) {
            allCrops[cropIndex].quantity -= quantity;
            if (allCrops[cropIndex].quantity <= 0) {
                allCrops[cropIndex].status = 'sold';
            }
            DataManager.saveCrops(allCrops);
        }

        // Close modal and refresh
        document.getElementById('orderModal').style.display = 'none';
        this.loadCrops();
        this.loadOrders();
        this.updateStats();
        this.displayOrders();
        
        showNotification('Order placed successfully!', 'success');
    }

    displayOrders(filter = 'all') {
        const ordersList = document.getElementById('ordersList');
        let filteredOrders = this.orders;

        if (filter !== 'all') {
            filteredOrders = this.orders.filter(order => order.status === filter);
        }

        if (filteredOrders.length === 0) {
            ordersList.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-shopping-cart"></i>
                    <p>No orders found</p>
                </div>
            `;
            return;
        }

        ordersList.innerHTML = `
            <div class="orders-table">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Crop</th>
                            <th>Farmer</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredOrders.map(order => `
                            <tr>
                                <td>${order.cropName}</td>
                                <td>${order.farmerName}</td>
                                <td>${order.quantity} ${order.unit}</td>
                                <td>${formatPrice(order.totalPrice)}</td>
                                <td>
                                    <span class="badge badge-${order.status}">${order.status}</span>
                                </td>
                                <td>${formatDate(order.createdAt)}</td>
                                <td>
                                    <button class="btn btn-outline btn-small" onclick="dealerDashboard.viewOrderDetails(${order.id})">
                                        <i class="fas fa-eye"></i> View
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    toggleFavorite(farmerId, farmerName) {
        const existingFavorite = this.favoriteFarmers.find(fav => fav.farmerId === farmerId);
        
        if (existingFavorite) {
            // Remove from favorites
            this.favoriteFarmers = this.favoriteFarmers.filter(fav => fav.farmerId !== farmerId);
            showNotification('Removed from favorites', 'info');
        } else {
            // Add to favorites
            const favorite = {
                id: Date.now(),
                dealerId: this.currentUser.id,
                farmerId: farmerId,
                farmerName: farmerName,
                addedAt: new Date().toISOString()
            };
            this.favoriteFarmers.push(favorite);
            showNotification('Added to favorites', 'success');
        }

        // Save favorites
        const allFavorites = JSON.parse(localStorage.getItem('favoriteFarmers') || '[]');
        const otherFavorites = allFavorites.filter(fav => fav.dealerId !== this.currentUser.id);
        localStorage.setItem('favoriteFarmers', JSON.stringify([...otherFavorites, ...this.favoriteFarmers]));

        this.updateStats();
        this.displayFavoriteFarmers();
    }

    displayFavoriteFarmers() {
        const favoriteFarmersList = document.getElementById('favoriteFarmersList');
        
        if (this.favoriteFarmers.length === 0) {
            favoriteFarmersList.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-heart"></i>
                    <p>No favorite farmers yet</p>
                </div>
            `;
            return;
        }

        favoriteFarmersList.innerHTML = `
            <div class="farmers-grid">
                ${this.favoriteFarmers.map(fav => `
                    <div class="farmer-card">
                        <div class="farmer-info">
                            <h3>${fav.farmerName}</h3>
                            <p>Added on ${formatDate(fav.addedAt)}</p>
                        </div>
                        <div class="farmer-actions">
                            <button class="btn btn-outline btn-small" onclick="dealerDashboard.viewFarmerCrops(${fav.farmerId})">
                                <i class="fas fa-seedling"></i> View Crops
                            </button>
                            <button class="btn btn-outline btn-small" onclick="dealerDashboard.removeFavorite(${fav.farmerId})">
                                <i class="fas fa-heart-broken"></i> Remove
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    updateStats() {
        const totalPurchases = this.orders.length;
        const pendingOrders = this.orders.filter(order => order.status === 'pending').length;
        const totalSpent = this.orders.reduce((sum, order) => sum + order.totalPrice, 0);
        const favoriteFarmers = this.favoriteFarmers.length;

        document.getElementById('totalPurchases').textContent = totalPurchases;
        document.getElementById('pendingOrders').textContent = pendingOrders;
        document.getElementById('totalSpent').textContent = formatPrice(totalSpent);
        document.getElementById('favoriteFarmers').textContent = favoriteFarmers;
    }

    sortCrops(sortBy) {
        switch (sortBy) {
            case 'price':
                this.filteredCrops.sort((a, b) => a.price - b.price);
                break;
            case 'quantity':
                this.filteredCrops.sort((a, b) => b.quantity - a.quantity);
                break;
            case 'date':
                this.filteredCrops.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }
        this.displayCrops();
    }
}

// Global functions
function clearFilters() {
    document.getElementById('searchForm').reset();
    if (window.dealerDashboard) {
        window.dealerDashboard.filteredCrops = [...window.dealerDashboard.crops];
        window.dealerDashboard.displayCrops();
    }
}

function sortCrops(sortBy) {
    if (window.dealerDashboard) {
        window.dealerDashboard.sortCrops(sortBy);
    }
}

function filterOrders(filter) {
    if (window.dealerDashboard) {
        window.dealerDashboard.displayOrders(filter);
    }
}

// Initialize dealer dashboard
document.addEventListener('DOMContentLoaded', function() {
    window.dealerDashboard = new DealerDashboard();
});
