// Service Provider Dashboard JavaScript
class ServiceDashboard {
    constructor() {
        this.currentUser = null;
        this.products = [];
        this.rawMaterialRequests = [];
        this.partnerships = [];
        this.init();
    }

    init() {
        // Check if user is logged in and is a service provider
        this.currentUser = DataManager.getCurrentUser();
        if (!this.currentUser || this.currentUser.role !== 'service') {
            window.location.href = 'index.html';
            return;
        }

        // Update service provider name
        document.getElementById('serviceName').textContent = this.currentUser.name;

        // Load data
        this.loadProducts();
        this.loadRawMaterialRequests();
        this.loadPartnerships();
        this.updateStats();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Add product form
        const addProductForm = document.getElementById('addProductForm');
        if (addProductForm) {
            addProductForm.addEventListener('submit', (e) => this.handleAddProduct(e));
        }

        // Edit product form
        const editProductForm = document.getElementById('editProductForm');
        if (editProductForm) {
            editProductForm.addEventListener('submit', (e) => this.handleEditProduct(e));
        }

        // Raw material form
        const rawMaterialForm = document.getElementById('rawMaterialForm');
        if (rawMaterialForm) {
            rawMaterialForm.addEventListener('submit', (e) => this.handleRawMaterialRequest(e));
        }
    }

    loadProducts() {
        this.products = DataManager.getProducts().filter(product => product.providerId === this.currentUser.id);
        this.displayProducts();
    }

    loadRawMaterialRequests() {
        this.rawMaterialRequests = JSON.parse(localStorage.getItem('rawMaterialRequests') || '[]')
            .filter(request => request.providerId === this.currentUser.id);
        this.displayRawMaterialRequests();
    }

    loadPartnerships() {
        this.partnerships = JSON.parse(localStorage.getItem('partnerships') || '[]')
            .filter(partnership => partnership.providerId === this.currentUser.id);
        this.displayPartnerships();
    }

    displayProducts(filter = 'all') {
        const productsList = document.getElementById('productsList');
        let filteredProducts = this.products;

        if (filter !== 'all') {
            filteredProducts = this.products.filter(product => product.status === filter);
        }

        if (filteredProducts.length === 0) {
            productsList.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-box"></i>
                    <p>No products found</p>
                </div>
            `;
            return;
        }

        productsList.innerHTML = filteredProducts.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    ${product.image ? `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                      `<i class="fas fa-box" style="font-size: 3rem; color: #8B4513;"></i>`}
                </div>
                <div class="product-info">
                    <div class="product-title">${product.name}</div>
                    <div class="product-price">${formatPrice(product.price)}/${product.unit}</div>
                    <div class="product-type">
                        <i class="fas fa-tag"></i> ${product.type}
                    </div>
                    <div class="product-details">
                        <span class="badge badge-${product.certification.replace(' ', '-').toLowerCase()}">${product.certification}</span>
                        <span class="badge badge-${product.status}">${product.status}</span>
                    </div>
                    ${product.description ? `<div class="product-description">${product.description}</div>` : ''}
                    <div class="product-actions">
                        <button class="btn btn-outline btn-small" onclick="serviceDashboard.editProduct(${product.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-outline btn-small" onclick="serviceDashboard.deleteProduct(${product.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    handleAddProduct(e) {
        e.preventDefault();
        
        const productData = {
            id: Date.now(),
            providerId: this.currentUser.id,
            providerName: this.currentUser.name,
            name: document.getElementById('productName').value,
            type: document.getElementById('productType').value,
            price: parseFloat(document.getElementById('productPrice').value),
            unit: document.getElementById('productUnit').value,
            certification: document.getElementById('productCertification').value,
            description: document.getElementById('productDescription').value,
            image: document.getElementById('productImage').value || 'https://via.placeholder.com/300x200?text=Product',
            status: 'available',
            createdAt: new Date().toISOString()
        };

        // Add to products array
        this.products.push(productData);
        
        // Save to localStorage
        const allProducts = DataManager.getProducts();
        allProducts.push(productData);
        DataManager.saveProducts(allProducts);

        // Reset form
        document.getElementById('addProductForm').reset();
        
        // Update display
        this.displayProducts();
        this.updateStats();
        
        showNotification('Product added successfully!', 'success');
    }

    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Fill edit form
        document.getElementById('editProductId').value = product.id;
        document.getElementById('editProductName').value = product.name;
        document.getElementById('editProductType').value = product.type;
        document.getElementById('editProductPrice').value = product.price;
        document.getElementById('editProductUnit').value = product.unit;
        document.getElementById('editProductCertification').value = product.certification;
        document.getElementById('editProductDescription').value = product.description;
        document.getElementById('editProductImage').value = product.image;

        // Show modal
        document.getElementById('editProductModal').style.display = 'block';
    }

    handleEditProduct(e) {
        e.preventDefault();
        
        const productId = parseInt(document.getElementById('editProductId').value);
        const productIndex = this.products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) return;

        // Update product data
        this.products[productIndex] = {
            ...this.products[productIndex],
            name: document.getElementById('editProductName').value,
            type: document.getElementById('editProductType').value,
            price: parseFloat(document.getElementById('editProductPrice').value),
            unit: document.getElementById('editProductUnit').value,
            certification: document.getElementById('editProductCertification').value,
            description: document.getElementById('editProductDescription').value,
            image: document.getElementById('editProductImage').value
        };

        // Save to localStorage
        const allProducts = DataManager.getProducts();
        const allProductIndex = allProducts.findIndex(p => p.id === productId);
        if (allProductIndex !== -1) {
            allProducts[allProductIndex] = this.products[productIndex];
            DataManager.saveProducts(allProducts);
        }

        // Update display
        this.displayProducts();
        this.updateStats();
        
        // Close modal
        document.getElementById('editProductModal').style.display = 'none';
        
        showNotification('Product updated successfully!', 'success');
    }

    deleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        // Remove from products array
        this.products = this.products.filter(p => p.id !== productId);
        
        // Save to localStorage
        const allProducts = DataManager.getProducts();
        const updatedProducts = allProducts.filter(p => p.id !== productId);
        DataManager.saveProducts(updatedProducts);

        // Update display
        this.displayProducts();
        this.updateStats();
        
        showNotification('Product deleted successfully!', 'success');
    }

    displayRawMaterialRequests() {
        const rawMaterialsList = document.getElementById('rawMaterialsList');
        
        if (this.rawMaterialRequests.length === 0) {
            rawMaterialsList.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-seedling"></i>
                    <p>No raw material requests yet</p>
                </div>
            `;
            return;
        }

        rawMaterialsList.innerHTML = `
            <div class="requests-grid">
                ${this.rawMaterialRequests.map(request => `
                    <div class="request-card">
                        <div class="request-header">
                            <h3>${request.milletType}</h3>
                            <span class="badge badge-${request.status}">${request.status}</span>
                        </div>
                        <div class="request-details">
                            <p><strong>Quantity:</strong> ${request.quantity} ${request.unit}</p>
                            <p><strong>Quality:</strong> ${request.quality}</p>
                            <p><strong>Created:</strong> ${formatDate(request.createdAt)}</p>
                            ${request.notes ? `<p><strong>Notes:</strong> ${request.notes}</p>` : ''}
                        </div>
                        <div class="request-actions">
                            <button class="btn btn-outline btn-small" onclick="serviceDashboard.viewSuppliers(${request.id})">
                                <i class="fas fa-search"></i> Find Suppliers
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    handleRawMaterialRequest(e) {
        e.preventDefault();
        
        const requestData = {
            id: Date.now(),
            providerId: this.currentUser.id,
            providerName: this.currentUser.name,
            milletType: document.getElementById('rawMaterialType').value,
            quantity: parseInt(document.getElementById('rawMaterialQuantity').value),
            unit: document.getElementById('rawMaterialUnit').value,
            quality: document.getElementById('rawMaterialQuality').value,
            notes: document.getElementById('rawMaterialNotes').value,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // Add to requests array
        this.rawMaterialRequests.push(requestData);
        
        // Save to localStorage
        const allRequests = JSON.parse(localStorage.getItem('rawMaterialRequests') || '[]');
        allRequests.push(requestData);
        localStorage.setItem('rawMaterialRequests', JSON.stringify(allRequests));

        // Reset form
        document.getElementById('rawMaterialForm').reset();
        
        // Update display
        this.displayRawMaterialRequests();
        
        showNotification('Raw material request created successfully!', 'success');
    }

    displayPartnerships() {
        const partnershipsList = document.getElementById('partnershipsList');
        
        if (this.partnerships.length === 0) {
            partnershipsList.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-handshake"></i>
                    <p>No partnerships yet</p>
                </div>
            `;
            return;
        }

        partnershipsList.innerHTML = `
            <div class="partnerships-grid">
                ${this.partnerships.map(partnership => `
                    <div class="partnership-card">
                        <div class="partnership-header">
                            <h3>${partnership.title}</h3>
                            <span class="badge badge-${partnership.status}">${partnership.status}</span>
                        </div>
                        <div class="partnership-details">
                            <p><strong>Type:</strong> ${partnership.type}</p>
                            <p><strong>Created:</strong> ${formatDate(partnership.createdAt)}</p>
                            <p><strong>Description:</strong> ${partnership.description}</p>
                        </div>
                        <div class="partnership-actions">
                            <button class="btn btn-outline btn-small" onclick="serviceDashboard.viewPartnership(${partnership.id})">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    updateStats() {
        const totalProducts = this.products.length;
        const soldProducts = this.products.filter(p => p.status === 'sold').length;
        const availableProducts = this.products.filter(p => p.status === 'available').length;
        
        // Calculate total revenue (simplified)
        const totalRevenue = this.products
            .filter(p => p.status === 'sold')
            .reduce((sum, product) => sum + product.price, 0);

        document.getElementById('totalProducts').textContent = totalProducts;
        document.getElementById('soldProducts').textContent = soldProducts;
        document.getElementById('pendingOrders').textContent = availableProducts;
        document.getElementById('totalRevenue').textContent = formatPrice(totalRevenue);
    }

    viewSuppliers(requestId) {
        const request = this.rawMaterialRequests.find(r => r.id === requestId);
        if (!request) return;

        // Find available crops matching the request
        const availableCrops = DataManager.getCrops().filter(crop => 
            crop.type === request.milletType && 
            crop.quality === request.quality &&
            crop.status === 'available' &&
            crop.quantity >= request.quantity
        );

        if (availableCrops.length === 0) {
            showNotification('No suppliers found for your requirements', 'info');
            return;
        }

        const suppliersList = availableCrops.map(crop => `
            <div class="supplier-card">
                <h3>${crop.farmerName}</h3>
                <p><strong>Crop:</strong> ${crop.name}</p>
                <p><strong>Available:</strong> ${crop.quantity} ${crop.unit}</p>
                <p><strong>Price:</strong> ${formatPrice(crop.price)}/${crop.unit}</p>
                <p><strong>Location:</strong> ${crop.location}</p>
                <button class="btn btn-primary btn-small" onclick="serviceDashboard.contactFarmer(${crop.farmerId}, ${requestId})">
                    <i class="fas fa-phone"></i> Contact Farmer
                </button>
            </div>
        `).join('');

        alert(`Available Suppliers:\n\n${suppliersList}`);
    }

    contactFarmer(farmerId, requestId) {
        showNotification('Contact request sent to farmer!', 'success');
        
        // Update request status
        const requestIndex = this.rawMaterialRequests.findIndex(r => r.id === requestId);
        if (requestIndex !== -1) {
            this.rawMaterialRequests[requestIndex].status = 'contacted';
            
            // Save to localStorage
            const allRequests = JSON.parse(localStorage.getItem('rawMaterialRequests') || '[]');
            const allRequestIndex = allRequests.findIndex(r => r.id === requestId);
            if (allRequestIndex !== -1) {
                allRequests[allRequestIndex].status = 'contacted';
                localStorage.setItem('rawMaterialRequests', JSON.stringify(allRequests));
            }
        }
        
        this.displayRawMaterialRequests();
    }
}

// Global functions
function filterProducts(filter) {
    if (window.serviceDashboard) {
        window.serviceDashboard.displayProducts(filter);
    }
}

function showRawMaterialModal() {
    document.getElementById('rawMaterialModal').style.display = 'block';
}

function showPartnershipModal() {
    const title = prompt('Partnership Title:');
    if (!title) return;
    
    const type = prompt('Partnership Type (e.g., Supply Agreement, Processing Contract):');
    if (!type) return;
    
    const description = prompt('Description:');
    if (!description) return;

    const partnership = {
        id: Date.now(),
        providerId: window.serviceDashboard.currentUser.id,
        providerName: window.serviceDashboard.currentUser.name,
        title: title,
        type: type,
        description: description,
        status: 'active',
        createdAt: new Date().toISOString()
    };

    // Add to partnerships
    window.serviceDashboard.partnerships.push(partnership);
    
    // Save to localStorage
    const allPartnerships = JSON.parse(localStorage.getItem('partnerships') || '[]');
    allPartnerships.push(partnership);
    localStorage.setItem('partnerships', JSON.stringify(allPartnerships));

    window.serviceDashboard.displayPartnerships();
    showNotification('Partnership request created successfully!', 'success');
}

// Initialize service dashboard
document.addEventListener('DOMContentLoaded', function() {
    window.serviceDashboard = new ServiceDashboard();
});
