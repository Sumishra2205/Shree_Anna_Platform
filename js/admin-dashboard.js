// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.currentUser = null;
        this.users = [];
        this.crops = [];
        this.products = [];
        this.orders = [];
        this.selectedUserId = null;
        this.init();
    }

    init() {
        // Check if user is logged in and is an admin
        this.currentUser = DataManager.getCurrentUser();
        if (!this.currentUser || this.currentUser.role !== 'admin') {
            window.location.href = 'index.html';
            return;
        }

        // Update admin name
        document.getElementById('adminName').textContent = this.currentUser.name;

        // Load data
        this.loadData();
        this.updateStats();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Any additional event listeners can be added here
    }

    loadData() {
        this.users = DataManager.getUsers();
        this.crops = DataManager.getCrops();
        this.products = DataManager.getProducts();
        this.orders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        this.displayUsers();
        this.displayUserDistribution();
        this.displayRecentActivity();
        this.displayTraceabilityOverview();
    }

    displayUsers(filter = 'all') {
        const usersList = document.getElementById('usersList');
        let filteredUsers = this.users;

        if (filter !== 'all') {
            filteredUsers = this.users.filter(user => user.role === filter);
        }

        if (filteredUsers.length === 0) {
            usersList.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-users"></i>
                    <p>No users found</p>
                </div>
            `;
            return;
        }

        usersList.innerHTML = `
            <div class="users-table">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredUsers.map(user => `
                            <tr>
                                <td>${user.name}</td>
                                <td>${user.email}</td>
                                <td>
                                    <span class="badge badge-${user.role}">${user.role}</span>
                                </td>
                                <td>${formatDate(user.createdAt)}</td>
                                <td>
                                    <span class="badge badge-active">Active</span>
                                </td>
                                <td>
                                    <button class="btn btn-outline btn-small" onclick="adminDashboard.viewUser(${user.id})">
                                        <i class="fas fa-eye"></i> View
                                    </button>
                                    <button class="btn btn-outline btn-small" onclick="adminDashboard.editUser(${user.id})">
                                        <i class="fas fa-edit"></i> Edit
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    viewUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        this.selectedUserId = userId;
        
        const userDetails = document.getElementById('userDetails');
        userDetails.innerHTML = `
            <div class="user-details">
                <h3>${user.name}</h3>
                <div class="detail-row">
                    <strong>Email:</strong> ${user.email}
                </div>
                <div class="detail-row">
                    <strong>Role:</strong> <span class="badge badge-${user.role}">${user.role}</span>
                </div>
                <div class="detail-row">
                    <strong>Joined:</strong> ${formatDate(user.createdAt)}
                </div>
                <div class="detail-row">
                    <strong>Status:</strong> <span class="badge badge-active">Active</span>
                </div>
            </div>
        `;

        document.getElementById('userModal').style.display = 'block';
    }

    editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        const newName = prompt('Enter new name:', user.name);
        if (newName && newName !== user.name) {
            user.name = newName;
            this.saveUsers();
            this.displayUsers();
            showNotification('User updated successfully!', 'success');
        }
    }

    approveUser() {
        if (!this.selectedUserId) return;
        
        showNotification('User approved successfully!', 'success');
        this.closeModal('userModal');
    }

    suspendUser() {
        if (!this.selectedUserId) return;
        
        if (confirm('Are you sure you want to suspend this user?')) {
            showNotification('User suspended successfully!', 'success');
            this.closeModal('userModal');
        }
    }

    deleteUser() {
        if (!this.selectedUserId) return;
        
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            this.users = this.users.filter(u => u.id !== this.selectedUserId);
            this.saveUsers();
            this.displayUsers();
            this.updateStats();
            this.closeModal('userModal');
            showNotification('User deleted successfully!', 'success');
        }
    }

    saveUsers() {
        DataManager.saveUsers(this.users);
    }

    displayUserDistribution() {
        const userDistribution = document.getElementById('userDistribution');
        
        const roleCounts = this.users.reduce((acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
        }, {});

        userDistribution.innerHTML = Object.entries(roleCounts).map(([role, count]) => `
            <div class="distribution-item">
                <span class="role-name">${role}</span>
                <span class="role-count">${count}</span>
            </div>
        `).join('');
    }

    displayRecentActivity() {
        const recentActivity = document.getElementById('recentActivity');
        
        // Get recent activities (simplified)
        const activities = [
            { type: 'user', message: 'New farmer registered', time: '2 hours ago' },
            { type: 'crop', message: 'New crop listed', time: '3 hours ago' },
            { type: 'order', message: 'Order placed', time: '4 hours ago' },
            { type: 'product', message: 'New product added', time: '5 hours ago' }
        ];

        recentActivity.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                <div class="activity-content">
                    <p>${activity.message}</p>
                    <small>${activity.time}</small>
                </div>
            </div>
        `).join('');
    }

    getActivityIcon(type) {
        const icons = {
            'user': 'user-plus',
            'crop': 'seedling',
            'order': 'shopping-cart',
            'product': 'box'
        };
        return icons[type] || 'info';
    }

    displayTraceabilityOverview() {
        const traceabilityOverview = document.getElementById('traceabilityOverview');
        
        // Calculate traceability metrics
        const totalCrops = this.crops.length;
        const soldCrops = this.crops.filter(c => c.status === 'sold').length;
        const traceabilityRate = totalCrops > 0 ? (soldCrops / totalCrops * 100).toFixed(1) : 0;

        traceabilityOverview.innerHTML = `
            <div class="traceability-stats">
                <div class="traceability-item">
                    <h3>Traceability Rate</h3>
                    <div class="traceability-value">${traceabilityRate}%</div>
                </div>
                <div class="traceability-item">
                    <h3>Total Crops</h3>
                    <div class="traceability-value">${totalCrops}</div>
                </div>
                <div class="traceability-item">
                    <h3>Sold Crops</h3>
                    <div class="traceability-value">${soldCrops}</div>
                </div>
            </div>
            <div class="traceability-chart">
                <h3>Supply Chain Flow</h3>
                <div class="supply-chain">
                    <div class="chain-step">
                        <i class="fas fa-seedling"></i>
                        <span>Farmers</span>
                    </div>
                    <div class="chain-arrow">→</div>
                    <div class="chain-step">
                        <i class="fas fa-truck"></i>
                        <span>Transporters</span>
                    </div>
                    <div class="chain-arrow">→</div>
                    <div class="chain-step">
                        <i class="fas fa-store"></i>
                        <span>Dealers</span>
                    </div>
                    <div class="chain-arrow">→</div>
                    <div class="chain-step">
                        <i class="fas fa-industry"></i>
                        <span>Processors</span>
                    </div>
                </div>
            </div>
        `;
    }

    updateStats() {
        const totalUsers = this.users.length;
        const totalCrops = this.crops.length;
        const totalProducts = this.products.length;
        const totalOrders = this.orders.length;

        document.getElementById('totalUsers').textContent = totalUsers;
        document.getElementById('totalCrops').textContent = totalCrops;
        document.getElementById('totalProducts').textContent = totalProducts;
        document.getElementById('totalOrders').textContent = totalOrders;
    }

    exportData() {
        const data = {
            users: this.users,
            crops: this.crops,
            products: this.products,
            orders: this.orders,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `shree-anna-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        showNotification('Data exported successfully!', 'success');
    }

    clearOldData() {
        if (confirm('Are you sure you want to clear old data? This action cannot be undone.')) {
            // Clear data older than 30 days (simplified)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            // Clear old crops
            const recentCrops = this.crops.filter(crop => 
                new Date(crop.createdAt) > thirtyDaysAgo
            );
            DataManager.saveCrops(recentCrops);

            // Clear old orders
            const recentOrders = this.orders.filter(order => 
                new Date(order.createdAt) > thirtyDaysAgo
            );
            localStorage.setItem('orders', JSON.stringify(recentOrders));

            this.loadData();
            this.updateStats();
            showNotification('Old data cleared successfully!', 'success');
        }
    }

    resetPlatform() {
        if (confirm('Are you sure you want to reset the platform? This will delete ALL data and cannot be undone.')) {
            if (confirm('This is your final warning. All data will be permanently deleted.')) {
                // Clear all data
                localStorage.clear();
                
                // Reinitialize sample data
                if (typeof initializeSampleData === 'function') {
                    initializeSampleData();
                }
                
                this.loadData();
                this.updateStats();
                showNotification('Platform reset successfully!', 'success');
            }
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

// Global functions
function filterUsers(filter) {
    if (window.adminDashboard) {
        window.adminDashboard.displayUsers(filter);
    }
}

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    window.adminDashboard = new AdminDashboard();
});
