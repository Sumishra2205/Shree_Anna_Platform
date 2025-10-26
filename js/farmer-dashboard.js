// Enhanced Farmer Dashboard JavaScript
class FarmerDashboard {
    constructor() {
        this.currentUser = null;
        this.crops = [];
        this.orders = [];
        this.chatContacts = [];
        this.selectedContact = null;
        this.init();
    }

    init() {
        // Check if user is logged in and is a farmer
        this.currentUser = DataManager.getCurrentUser();
        if (!this.currentUser || this.currentUser.role !== 'farmer') {
            window.location.href = 'index.html';
            return;
        }

        // Update farmer name
        document.getElementById('farmerName').textContent = this.currentUser.name;

        // Load data
        this.loadCrops();
        this.loadOrders();
        this.loadProfile();
        this.loadChatContacts();
        this.updateStats();
        this.setupEventListeners();
        this.initializeAnalytics();
        this.updatePricePrediction();
    }

    setupEventListeners() {
        // Add crop form
        const addCropForm = document.getElementById('addCropForm');
        if (addCropForm) {
            addCropForm.addEventListener('submit', (e) => this.handleAddCrop(e));
        }

        // Edit crop form
        const editCropForm = document.getElementById('editCropForm');
        if (editCropForm) {
            editCropForm.addEventListener('submit', (e) => this.handleEditCrop(e));
        }

        // Profile form
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        }

        // Chat input
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // Analytics period change
        const analyticsPeriod = document.getElementById('analyticsPeriod');
        if (analyticsPeriod) {
            analyticsPeriod.addEventListener('change', () => this.updateAnalytics());
        }
    }

    loadCrops() {
        this.crops = DataManager.getCrops().filter(crop => crop.farmerId === this.currentUser.id);
        this.displayCrops();
    }

    displayCrops(filter = 'all') {
        const cropsList = document.getElementById('cropsList');
        let filteredCrops = this.crops;

        if (filter !== 'all') {
            filteredCrops = this.crops.filter(crop => crop.status === filter);
        }

        if (filteredCrops.length === 0) {
            cropsList.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-seedling"></i>
                    <p>No crops found</p>
                </div>
            `;
            return;
        }

        cropsList.innerHTML = filteredCrops.map(crop => `
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
                    <div class="product-details">
                        <span class="badge badge-${crop.quality.toLowerCase()}">${crop.quality}</span>
                        <span class="badge badge-${crop.status}">${crop.status}</span>
                    </div>
                    <div class="product-quantity">
                        <strong>Quantity:</strong> ${crop.quantity} ${crop.unit}
                    </div>
                    ${crop.description ? `<div class="product-description">${crop.description}</div>` : ''}
                    <div class="product-actions">
                        <button class="btn btn-outline btn-small" onclick="farmerDashboard.editCrop(${crop.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-outline btn-small" onclick="farmerDashboard.deleteCrop(${crop.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    handleAddCrop(e) {
        e.preventDefault();
        
        const cropData = {
            id: Date.now(),
            farmerId: this.currentUser.id,
            farmerName: this.currentUser.name,
            name: document.getElementById('cropName').value,
            type: document.getElementById('cropType').value,
            quantity: parseInt(document.getElementById('cropQuantity').value),
            unit: document.getElementById('cropUnit').value,
            price: parseFloat(document.getElementById('cropPrice').value),
            location: document.getElementById('cropLocation').value,
            quality: document.getElementById('cropQuality').value,
            description: document.getElementById('cropDescription').value,
            image: document.getElementById('cropImage').value || 'https://via.placeholder.com/300x200?text=Millet',
            status: 'available',
            createdAt: new Date().toISOString()
        };

        // Add to crops array
        this.crops.push(cropData);
        
        // Save to localStorage
        const allCrops = DataManager.getCrops();
        allCrops.push(cropData);
        DataManager.saveCrops(allCrops);

        // Reset form
        document.getElementById('addCropForm').reset();
        
        // Update display
        this.displayCrops();
        this.updateStats();
        
        showNotification('Crop added successfully!', 'success');
    }

    editCrop(cropId) {
        const crop = this.crops.find(c => c.id === cropId);
        if (!crop) return;

        // Fill edit form
        document.getElementById('editCropId').value = crop.id;
        document.getElementById('editCropName').value = crop.name;
        document.getElementById('editCropType').value = crop.type;
        document.getElementById('editCropQuantity').value = crop.quantity;
        document.getElementById('editCropUnit').value = crop.unit;
        document.getElementById('editCropPrice').value = crop.price;
        document.getElementById('editCropLocation').value = crop.location;
        document.getElementById('editCropQuality').value = crop.quality;
        document.getElementById('editCropDescription').value = crop.description;
        document.getElementById('editCropImage').value = crop.image;

        // Show modal
        document.getElementById('editCropModal').style.display = 'block';
    }

    handleEditCrop(e) {
        e.preventDefault();
        
        const cropId = parseInt(document.getElementById('editCropId').value);
        const cropIndex = this.crops.findIndex(c => c.id === cropId);
        
        if (cropIndex === -1) return;

        // Update crop data
        this.crops[cropIndex] = {
            ...this.crops[cropIndex],
            name: document.getElementById('editCropName').value,
            type: document.getElementById('editCropType').value,
            quantity: parseInt(document.getElementById('editCropQuantity').value),
            unit: document.getElementById('editCropUnit').value,
            price: parseFloat(document.getElementById('editCropPrice').value),
            location: document.getElementById('editCropLocation').value,
            quality: document.getElementById('editCropQuality').value,
            description: document.getElementById('editCropDescription').value,
            image: document.getElementById('editCropImage').value
        };

        // Save to localStorage
        const allCrops = DataManager.getCrops();
        const allCropIndex = allCrops.findIndex(c => c.id === cropId);
        if (allCropIndex !== -1) {
            allCrops[allCropIndex] = this.crops[cropIndex];
            DataManager.saveCrops(allCrops);
        }

        // Update display
        this.displayCrops();
        this.updateStats();
        
        // Close modal
        document.getElementById('editCropModal').style.display = 'none';
        
        showNotification('Crop updated successfully!', 'success');
    }

    deleteCrop(cropId) {
        if (!confirm('Are you sure you want to delete this crop?')) return;

        // Remove from crops array
        this.crops = this.crops.filter(c => c.id !== cropId);
        
        // Save to localStorage
        const allCrops = DataManager.getCrops();
        const updatedCrops = allCrops.filter(c => c.id !== cropId);
        DataManager.saveCrops(updatedCrops);

        // Update display
        this.displayCrops();
        this.updateStats();
        
        showNotification('Crop deleted successfully!', 'success');
    }

    updateStats() {
        const totalCrops = this.crops.length;
        const soldCrops = this.crops.filter(c => c.status === 'sold').length;
        const availableCrops = this.crops.filter(c => c.status === 'available').length;
        
        // Calculate total revenue (simplified)
        const totalRevenue = this.crops
            .filter(c => c.status === 'sold')
            .reduce((sum, crop) => sum + (crop.price * crop.quantity), 0);

        document.getElementById('totalCrops').textContent = totalCrops;
        document.getElementById('soldCrops').textContent = soldCrops;
        document.getElementById('pendingOrders').textContent = availableCrops;
        document.getElementById('totalRevenue').textContent = formatPrice(totalRevenue);
    }

    // Load orders for the farmer
    loadOrders() {
        this.orders = JSON.parse(localStorage.getItem('orders') || '[]')
            .filter(order => order.sellerId === this.currentUser.id);
        this.displayOrderHistory();
    }

    // Display order history
    displayOrderHistory(filter = 'all') {
        const orderHistory = document.getElementById('orderHistory');
        let filteredOrders = this.orders;

        if (filter !== 'all') {
            filteredOrders = this.orders.filter(order => order.status === filter);
        }

        if (filteredOrders.length === 0) {
            orderHistory.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-history"></i>
                    <p>No orders found</p>
                </div>
            `;
            return;
        }

        orderHistory.innerHTML = filteredOrders.map(order => `
            <div class="order-item">
                <div class="order-header">
                    <span class="order-id">Order #${order.id}</span>
                    <span class="order-status badge-${order.status}">${order.status}</span>
                </div>
                <div class="order-details">
                    <p><strong>Buyer:</strong> ${order.buyerName}</p>
                    <p><strong>Items:</strong> ${order.items.length} items</p>
                    <p><strong>Total:</strong> ${formatPrice(order.totalAmount)}</p>
                    <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
                </div>
                <div class="order-actions">
                    <button class="btn btn-outline btn-small" onclick="farmerDashboard.viewOrderDetails(${order.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    ${order.status === 'pending' ? `
                        <button class="btn btn-primary btn-small" onclick="farmerDashboard.acceptOrder(${order.id})">
                            <i class="fas fa-check"></i> Accept
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    // Load profile data
    loadProfile() {
        const profile = JSON.parse(localStorage.getItem('userProfiles') || '{}')[this.currentUser.id] || {};
        
        document.getElementById('profileName').textContent = this.currentUser.name;
        document.getElementById('profileEmail').value = this.currentUser.email;
        document.getElementById('profilePhone').value = profile.phone || '';
        document.getElementById('profileAddress').value = profile.address || '';
        document.getElementById('profileExperience').value = profile.experience || '';
        document.getElementById('profileSpecialization').value = profile.specialization || '';
    }

    // Handle profile update
    handleProfileUpdate(e) {
        e.preventDefault();
        
        const profileData = {
            phone: document.getElementById('profilePhone').value,
            address: document.getElementById('profileAddress').value,
            experience: document.getElementById('profileExperience').value,
            specialization: document.getElementById('profileSpecialization').value
        };

        const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
        userProfiles[this.currentUser.id] = profileData;
        localStorage.setItem('userProfiles', JSON.stringify(userProfiles));

        showNotification('Profile updated successfully!', 'success');
    }

    // Load chat contacts
    loadChatContacts() {
        const users = DataManager.getUsers();
        this.chatContacts = users.filter(user => 
            user.id !== this.currentUser.id && 
            (user.role === 'dealer' || user.role === 'transporter' || user.role === 'service')
        );
        this.displayChatContacts();
    }

    // Display chat contacts
    displayChatContacts() {
        const chatContacts = document.getElementById('chatContacts');
        
        if (this.chatContacts.length === 0) {
            chatContacts.innerHTML = '<p>No contacts available</p>';
            return;
        }

        chatContacts.innerHTML = this.chatContacts.map(contact => `
            <div class="contact-item" onclick="farmerDashboard.selectContact(${contact.id})">
                <div class="contact-avatar">
                    ${contact.name.charAt(0).toUpperCase()}
                </div>
                <div class="contact-info">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-role">${contact.role}</div>
                </div>
                <div class="contact-status"></div>
            </div>
        `).join('');
    }

    // Select chat contact
    selectContact(contactId) {
        this.selectedContact = this.chatContacts.find(c => c.id === contactId);
        
        // Update UI
        document.querySelectorAll('.contact-item').forEach(item => item.classList.remove('active'));
        event.target.closest('.contact-item').classList.add('active');
        
        document.getElementById('chatWith').textContent = this.selectedContact.name;
        document.getElementById('chatInput').disabled = false;
        document.getElementById('sendMessageBtn').disabled = false;
        
        // Load chat history
        this.loadChatHistory();
    }

    // Load chat history
    loadChatHistory() {
        if (!this.selectedContact) return;

        const messages = platformUtils.getChatHistory(this.currentUser.id, this.selectedContact.id);
        const chatMessages = document.getElementById('chatMessages');
        
        chatMessages.innerHTML = messages.map(message => `
            <div class="chat-message ${message.senderId === this.currentUser.id ? 'sent' : 'received'}">
                <div class="message-bubble ${message.senderId === this.currentUser.id ? 'sent' : 'received'}">
                    ${message.message}
                </div>
                <div class="message-time">${formatDate(message.timestamp)}</div>
            </div>
        `).join('');

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Send message
    sendMessage() {
        if (!this.selectedContact) return;

        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (!message) return;

        // Send message
        platformUtils.sendMessage(this.currentUser.id, this.selectedContact.id, message);
        
        // Clear input
        chatInput.value = '';
        
        // Reload chat history
        this.loadChatHistory();
    }

    // Update price prediction
    updatePricePrediction() {
        const cropType = document.getElementById('cropType')?.value;
        const cropQuality = document.getElementById('cropQuality')?.value;
        const location = document.getElementById('cropLocation')?.value || 'Bangalore';

        if (cropType && cropQuality && typeof platformUtils !== 'undefined') {
            const predictedPrice = platformUtils.predictPrice(cropType, cropQuality, location);
            document.getElementById('predictedPrice').textContent = formatPrice(predictedPrice);
            
            // Update price input with predicted price
            const priceInput = document.getElementById('cropPrice');
            if (priceInput && !priceInput.value) {
                priceInput.value = predictedPrice;
            }
        }
    }

    // Initialize analytics
    initializeAnalytics() {
        if (typeof Chart !== 'undefined') {
            this.createSalesChart();
            this.createRevenueChart();
        }
    }

    // Create sales chart
    createSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;

        const salesData = this.getSalesData();
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: salesData.labels,
                datasets: [{
                    label: 'Crops Sold',
                    data: salesData.data,
                    backgroundColor: 'rgba(139, 69, 19, 0.2)',
                    borderColor: 'rgba(139, 69, 19, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Create revenue chart
    createRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        const revenueData = this.getRevenueData();
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: revenueData.labels,
                datasets: [{
                    label: 'Revenue',
                    data: revenueData.data,
                    borderColor: 'rgba(34, 139, 34, 1)',
                    backgroundColor: 'rgba(34, 139, 34, 0.2)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Get sales data for analytics
    getSalesData() {
        const period = parseInt(document.getElementById('analyticsPeriod')?.value || 30);
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - period * 24 * 60 * 60 * 1000);

        // Get crops sold in the period
        const soldCrops = this.crops.filter(crop => 
            crop.status === 'sold' && 
            new Date(crop.createdAt) >= startDate
        );

        // Group by crop type
        const cropTypes = {};
        soldCrops.forEach(crop => {
            cropTypes[crop.type] = (cropTypes[crop.type] || 0) + crop.quantity;
        });

        return {
            labels: Object.keys(cropTypes),
            data: Object.values(cropTypes)
        };
    }

    // Get revenue data for analytics
    getRevenueData() {
        const period = parseInt(document.getElementById('analyticsPeriod')?.value || 30);
        const days = Math.min(period, 30);
        const labels = [];
        const data = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
            
            // Calculate revenue for this day (simplified)
            const dayRevenue = Math.random() * 5000; // Mock data
            data.push(Math.round(dayRevenue));
        }

        return { labels, data };
    }

    // Update analytics when period changes
    updateAnalytics() {
        if (typeof Chart !== 'undefined') {
            this.createSalesChart();
            this.createRevenueChart();
        }
    }

    // View order details
    viewOrderDetails(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const details = `
            <div class="order-details-modal">
                <h3>Order #${order.id}</h3>
                <div class="detail-section">
                    <h4>Order Information</h4>
                    <p><strong>Buyer:</strong> ${order.buyerName}</p>
                    <p><strong>Status:</strong> ${order.status}</p>
                    <p><strong>Total Amount:</strong> ${formatPrice(order.totalAmount)}</p>
                    <p><strong>Order Date:</strong> ${formatDate(order.createdAt)}</p>
                </div>
                <div class="detail-section">
                    <h4>Items</h4>
                    ${order.items.map(item => `
                        <p>${item.name} - ${item.quantity} ${item.unit} @ ${formatPrice(item.price)}</p>
                    `).join('')}
                </div>
            </div>
        `;

        alert(details);
    }

    // Accept order
    acceptOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        // Update order status
        order.status = 'confirmed';
        
        // Save to localStorage
        const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const orderIndex = allOrders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            allOrders[orderIndex] = order;
            localStorage.setItem('orders', JSON.stringify(allOrders));
        }

        // Add notification
        if (typeof platformUtils !== 'undefined') {
            platformUtils.addNotification(order.buyerId, 'order', 'Your order has been confirmed by the farmer', { orderId });
        }

        // Refresh display
        this.loadOrders();
        showNotification('Order accepted successfully!', 'success');
    }

    // Refresh chat
    refreshChat() {
        this.loadChatContacts();
        if (this.selectedContact) {
            this.loadChatHistory();
        }
    }
}

// Global functions for farmer dashboard
function filterCrops(filter) {
    if (window.farmerDashboard) {
        window.farmerDashboard.displayCrops(filter);
    }
}

function filterOrders(filter) {
    if (window.farmerDashboard) {
        window.farmerDashboard.displayOrderHistory(filter);
    }
}

function updatePricePrediction() {
    if (window.farmerDashboard) {
        window.farmerDashboard.updatePricePrediction();
    }
}

function sendMessage() {
    if (window.farmerDashboard) {
        window.farmerDashboard.sendMessage();
    }
}

function refreshChat() {
    if (window.farmerDashboard) {
        window.farmerDashboard.refreshChat();
    }
}

// Initialize farmer dashboard
document.addEventListener('DOMContentLoaded', function() {
    window.farmerDashboard = new FarmerDashboard();
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}
