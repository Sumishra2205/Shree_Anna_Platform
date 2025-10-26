// Transporter Dashboard JavaScript
class TransporterDashboard {
    constructor() {
        this.currentUser = null;
        this.transportRequests = [];
        this.myDeliveries = [];
        this.init();
    }

    init() {
        // Check if user is logged in and is a transporter
        this.currentUser = DataManager.getCurrentUser();
        if (!this.currentUser || this.currentUser.role !== 'transporter') {
            window.location.href = 'index.html';
            return;
        }

        // Update transporter name
        document.getElementById('transporterName').textContent = this.currentUser.name;

        // Load data
        this.loadTransportRequests();
        this.loadMyDeliveries();
        this.updateStats();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Status update form
        const statusUpdateForm = document.getElementById('statusUpdateForm');
        if (statusUpdateForm) {
            statusUpdateForm.addEventListener('submit', (e) => this.handleStatusUpdate(e));
        }

        // Delivery ID change
        const deliveryId = document.getElementById('deliveryId');
        if (deliveryId) {
            deliveryId.addEventListener('change', () => this.updateStatusOptions());
        }
    }

    loadTransportRequests() {
        this.transportRequests = DataManager.getTransportRequests();
        this.displayTransportRequests();
    }

    loadMyDeliveries() {
        this.myDeliveries = JSON.parse(localStorage.getItem('deliveries') || '[]')
            .filter(delivery => delivery.transporterId === this.currentUser.id);
        this.displayMyDeliveries();
        this.updateDeliverySelect();
    }

    displayTransportRequests(filter = 'all') {
        const requestsList = document.getElementById('transportRequestsList');
        let filteredRequests = this.transportRequests;

        if (filter !== 'all') {
            filteredRequests = this.transportRequests.filter(request => request.status === filter);
        }

        if (filteredRequests.length === 0) {
            requestsList.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-truck"></i>
                    <p>No transport requests found</p>
                </div>
            `;
            return;
        }

        requestsList.innerHTML = `
            <div class="requests-grid">
                ${filteredRequests.map(request => `
                    <div class="request-card">
                        <div class="request-header">
                            <h3>${request.cropName}</h3>
                            <span class="badge badge-${request.status}">${request.status}</span>
                        </div>
                        <div class="request-details">
                            <p><strong>From:</strong> ${request.from}</p>
                            <p><strong>To:</strong> ${request.to}</p>
                            <p><strong>Quantity:</strong> ${request.quantity} ${request.unit}</p>
                            <p><strong>Created:</strong> ${formatDate(request.createdAt)}</p>
                        </div>
                        <div class="request-actions">
                            <button class="btn btn-primary btn-small" onclick="transporterDashboard.viewRequestDetails(${request.id})">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                            ${request.status === 'pending' ? `
                                <button class="btn btn-outline btn-small" onclick="transporterDashboard.acceptRequest(${request.id})">
                                    <i class="fas fa-check"></i> Accept
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    displayMyDeliveries(filter = 'all') {
        const deliveriesList = document.getElementById('myDeliveriesList');
        let filteredDeliveries = this.myDeliveries;

        if (filter !== 'all') {
            filteredDeliveries = this.myDeliveries.filter(delivery => delivery.status === filter);
        }

        if (filteredDeliveries.length === 0) {
            deliveriesList.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-truck"></i>
                    <p>No deliveries found</p>
                </div>
            `;
            return;
        }

        deliveriesList.innerHTML = `
            <div class="deliveries-table">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Crop</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Assigned Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredDeliveries.map(delivery => `
                            <tr>
                                <td>${delivery.cropName}</td>
                                <td>${delivery.from}</td>
                                <td>${delivery.to}</td>
                                <td>${delivery.quantity} ${delivery.unit}</td>
                                <td>
                                    <span class="badge badge-${delivery.status}">${delivery.status}</span>
                                </td>
                                <td>${formatDate(delivery.assignedAt)}</td>
                                <td>
                                    <button class="btn btn-outline btn-small" onclick="transporterDashboard.viewDeliveryDetails(${delivery.id})">
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

    viewRequestDetails(requestId) {
        const request = this.transportRequests.find(r => r.id === requestId);
        if (!request) return;

        const requestDetails = document.getElementById('requestDetails');
        requestDetails.innerHTML = `
            <div class="request-details-full">
                <h3>${request.cropName}</h3>
                <div class="detail-row">
                    <strong>From:</strong> ${request.from}
                </div>
                <div class="detail-row">
                    <strong>To:</strong> ${request.to}
                </div>
                <div class="detail-row">
                    <strong>Quantity:</strong> ${request.quantity} ${request.unit}
                </div>
                <div class="detail-row">
                    <strong>Status:</strong> <span class="badge badge-${request.status}">${request.status}</span>
                </div>
                <div class="detail-row">
                    <strong>Created:</strong> ${formatDate(request.createdAt)}
                </div>
                ${request.notes ? `
                    <div class="detail-row">
                        <strong>Notes:</strong> ${request.notes}
                    </div>
                ` : ''}
            </div>
        `;

        document.getElementById('requestModal').style.display = 'block';
    }

    acceptRequest(requestId) {
        const request = this.transportRequests.find(r => r.id === requestId);
        if (!request) return;

        // Create delivery record
        const delivery = {
            id: Date.now(),
            transporterId: this.currentUser.id,
            transporterName: this.currentUser.name,
            requestId: requestId,
            cropName: request.cropName,
            from: request.from,
            to: request.to,
            quantity: request.quantity,
            unit: request.unit,
            status: 'assigned',
            assignedAt: new Date().toISOString(),
            notes: ''
        };

        // Save delivery
        const deliveries = JSON.parse(localStorage.getItem('deliveries') || '[]');
        deliveries.push(delivery);
        localStorage.setItem('deliveries', JSON.stringify(deliveries));

        // Update request status
        const allRequests = DataManager.getTransportRequests();
        const requestIndex = allRequests.findIndex(r => r.id === requestId);
        if (requestIndex !== -1) {
            allRequests[requestIndex].status = 'assigned';
            allRequests[requestIndex].transporterId = this.currentUser.id;
            allRequests[requestIndex].assignedAt = new Date().toISOString();
            localStorage.setItem('transportRequests', JSON.stringify(allRequests));
        }

        // Refresh data
        this.loadTransportRequests();
        this.loadMyDeliveries();
        this.updateStats();
        
        // Close modal
        document.getElementById('requestModal').style.display = 'none';
        
        showNotification('Transport request accepted successfully!', 'success');
    }

    updateDeliverySelect() {
        const deliverySelect = document.getElementById('deliveryId');
        const inTransitDeliveries = this.myDeliveries.filter(d => 
            d.status === 'assigned' || d.status === 'picked-up' || d.status === 'in-transit'
        );

        deliverySelect.innerHTML = '<option value="">Select a delivery</option>' +
            inTransitDeliveries.map(delivery => `
                <option value="${delivery.id}">${delivery.cropName} - ${delivery.from} to ${delivery.to}</option>
            `).join('');
    }

    updateStatusOptions() {
        const deliveryId = document.getElementById('deliveryId').value;
        const statusSelect = document.getElementById('deliveryStatus');
        
        if (!deliveryId) {
            statusSelect.innerHTML = '<option value="">Select status</option>';
            return;
        }

        const delivery = this.myDeliveries.find(d => d.id == deliveryId);
        if (!delivery) return;

        let options = '<option value="">Select status</option>';
        
        switch (delivery.status) {
            case 'assigned':
                options += '<option value="picked-up">Picked Up</option>';
                break;
            case 'picked-up':
                options += '<option value="in-transit">In Transit</option>';
                break;
            case 'in-transit':
                options += '<option value="delivered">Delivered</option>';
                break;
            default:
                options += '<option value="delivered">Delivered</option>';
        }

        statusSelect.innerHTML = options;
    }

    handleStatusUpdate(e) {
        e.preventDefault();
        
        const deliveryId = parseInt(document.getElementById('deliveryId').value);
        const newStatus = document.getElementById('deliveryStatus').value;
        const notes = document.getElementById('deliveryNotes').value;

        if (!deliveryId || !newStatus) {
            showNotification('Please select a delivery and status', 'error');
            return;
        }

        // Update delivery status
        const deliveries = JSON.parse(localStorage.getItem('deliveries') || '[]');
        const deliveryIndex = deliveries.findIndex(d => d.id === deliveryId);
        
        if (deliveryIndex !== -1) {
            deliveries[deliveryIndex].status = newStatus;
            deliveries[deliveryIndex].notes = notes;
            deliveries[deliveryIndex].updatedAt = new Date().toISOString();
            
            if (newStatus === 'delivered') {
                deliveries[deliveryIndex].deliveredAt = new Date().toISOString();
            }
            
            localStorage.setItem('deliveries', JSON.stringify(deliveries));
        }

        // Refresh data
        this.loadMyDeliveries();
        this.updateStats();
        
        // Reset form
        document.getElementById('statusUpdateForm').reset();
        
        showNotification('Delivery status updated successfully!', 'success');
    }

    updateStats() {
        const totalDeliveries = this.myDeliveries.length;
        const pendingDeliveries = this.myDeliveries.filter(d => 
            d.status === 'assigned' || d.status === 'picked-up' || d.status === 'in-transit'
        ).length;
        const completedDeliveries = this.myDeliveries.filter(d => d.status === 'delivered').length;
        
        // Calculate earnings (simplified - ₹100 per delivery)
        const totalEarnings = completedDeliveries * 100;

        document.getElementById('totalDeliveries').textContent = totalDeliveries;
        document.getElementById('pendingDeliveries').textContent = pendingDeliveries;
        document.getElementById('completedDeliveries').textContent = completedDeliveries;
        document.getElementById('totalEarnings').textContent = formatPrice(totalEarnings);
    }

    viewDeliveryDetails(deliveryId) {
        const delivery = this.myDeliveries.find(d => d.id === deliveryId);
        if (!delivery) return;

        const details = `
            <div class="delivery-details">
                <h3>${delivery.cropName}</h3>
                <p><strong>From:</strong> ${delivery.from}</p>
                <p><strong>To:</strong> ${delivery.to}</p>
                <p><strong>Quantity:</strong> ${delivery.quantity} ${delivery.unit}</p>
                <p><strong>Status:</strong> <span class="badge badge-${delivery.status}">${delivery.status}</span></p>
                <p><strong>Assigned:</strong> ${formatDate(delivery.assignedAt)}</p>
                ${delivery.notes ? `<p><strong>Notes:</strong> ${delivery.notes}</p>` : ''}
                ${delivery.deliveredAt ? `<p><strong>Delivered:</strong> ${formatDate(delivery.deliveredAt)}</p>` : ''}
            </div>
        `;

        alert(details);
    }
}

// Global functions
function filterRequests(filter) {
    if (window.transporterDashboard) {
        window.transporterDashboard.displayTransportRequests(filter);
    }
}

function filterDeliveries(filter) {
    if (window.transporterDashboard) {
        window.transporterDashboard.displayMyDeliveries(filter);
    }
}

// Initialize transporter dashboard
document.addEventListener('DOMContentLoaded', function() {
    window.transporterDashboard = new TransporterDashboard();
});
