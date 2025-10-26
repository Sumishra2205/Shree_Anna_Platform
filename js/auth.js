// Authentication and User Management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is already logged in
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateNavbar();
        }

        // Setup form event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.updateNavbar();
            this.closeModal('loginModal');
            this.redirectToDashboard();
            this.showMessage('Login successful!', 'success');
        } else {
            this.showMessage('Invalid email or password!', 'error');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const role = document.getElementById('registerRole').value;

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.email === email)) {
            this.showMessage('User with this email already exists!', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            role,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        this.showMessage('Registration successful! Please login.', 'success');
        this.closeModal('registerModal');
        this.showLogin();
    }

    updateNavbar() {
        const navAuth = document.getElementById('navAuth');
        const navUser = document.getElementById('navUser');
        const userName = document.getElementById('userName');

        if (this.currentUser) {
            navAuth.style.display = 'none';
            navUser.style.display = 'flex';
            userName.textContent = this.currentUser.name;
        } else {
            navAuth.style.display = 'flex';
            navUser.style.display = 'none';
        }
    }

    redirectToDashboard() {
        if (!this.currentUser) return;

        const role = this.currentUser.role;
        const dashboardPages = {
            'farmer': 'dashboard-farmer.html',
            'dealer': 'dashboard-dealer.html',
            'transporter': 'dashboard-transporter.html',
            'service': 'dashboard-service.html',
            'admin': 'dashboard-admin.html'
        };

        const dashboardPage = dashboardPages[role];
        if (dashboardPage) {
            window.location.href = dashboardPage;
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateNavbar();
        window.location.href = 'index.html';
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.error-message, .success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
        messageDiv.textContent = message;

        // Insert message
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.insertBefore(messageDiv, modalContent.firstChild);
        }

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }

    showLogin() {
        this.closeModal('registerModal');
        this.showModal('loginModal');
    }

    showRegister() {
        this.closeModal('loginModal');
        this.showModal('registerModal');
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Global functions for HTML onclick events
function showLogin() {
    authManager.showLogin();
}

function showRegister() {
    authManager.showRegister();
}

function logout() {
    authManager.logout();
}

function closeModal(modalId) {
    authManager.closeModal(modalId);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Initialize sample data if not exists
function initializeSampleData() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.length === 0) {
        const sampleUsers = [
            {
                id: 1,
                name: 'Rajesh Kumar',
                email: 'farmer@example.com',
                password: 'password',
                role: 'farmer',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Priya Sharma',
                email: 'dealer@example.com',
                password: 'password',
                role: 'dealer',
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                name: 'Amit Singh',
                email: 'transporter@example.com',
                password: 'password',
                role: 'transporter',
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                name: 'Sunita Patel',
                email: 'service@example.com',
                password: 'password',
                role: 'service',
                createdAt: new Date().toISOString()
            },
            {
                id: 5,
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password',
                role: 'admin',
                createdAt: new Date().toISOString()
            }
        ];

        localStorage.setItem('users', JSON.stringify(sampleUsers));
    }

    // Initialize sample crops data
    const crops = JSON.parse(localStorage.getItem('crops') || '[]');
    if (crops.length === 0) {
        const sampleCrops = [
            {
                id: 1,
                farmerId: 1,
                farmerName: 'Rajesh Kumar',
                name: 'Finger Millet (Ragi)',
                type: 'Finger Millet',
                quantity: 100,
                unit: 'kg',
                price: 45,
                location: 'Karnataka',
                quality: 'Organic',
                description: 'Premium quality organic ragi',
                image: 'https://via.placeholder.com/300x200?text=Ragi',
                status: 'available',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                farmerId: 1,
                farmerName: 'Rajesh Kumar',
                name: 'Pearl Millet (Bajra)',
                type: 'Pearl Millet',
                quantity: 150,
                unit: 'kg',
                price: 35,
                location: 'Karnataka',
                quality: 'Good',
                description: 'Fresh bajra from this season',
                image: 'https://via.placeholder.com/300x200?text=Bajra',
                status: 'available',
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                farmerId: 1,
                farmerName: 'Rajesh Kumar',
                name: 'Foxtail Millet',
                type: 'Foxtail Millet',
                quantity: 80,
                unit: 'kg',
                price: 55,
                location: 'Karnataka',
                quality: 'Premium',
                description: 'High quality foxtail millet',
                image: 'https://via.placeholder.com/300x200?text=Foxtail',
                status: 'available',
                createdAt: new Date().toISOString()
            }
        ];

        localStorage.setItem('crops', JSON.stringify(sampleCrops));
    }

    // Initialize sample products data
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    if (products.length === 0) {
        const sampleProducts = [
            {
                id: 1,
                providerId: 4,
                providerName: 'Sunita Patel',
                name: 'Ragi Flour',
                type: 'Processed',
                price: 80,
                unit: 'kg',
                description: 'Finely ground ragi flour',
                image: 'https://via.placeholder.com/300x200?text=Ragi+Flour',
                certification: 'Organic Certified',
                status: 'available',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                providerId: 4,
                providerName: 'Sunita Patel',
                name: 'Bajra Cookies',
                type: 'Value Added',
                price: 120,
                unit: 'pack',
                description: 'Healthy bajra cookies',
                image: 'https://via.placeholder.com/300x200?text=Bajra+Cookies',
                certification: 'FSSAI Approved',
                status: 'available',
                createdAt: new Date().toISOString()
            }
        ];

        localStorage.setItem('products', JSON.stringify(sampleProducts));
    }

    // Initialize sample transport requests
    const transportRequests = JSON.parse(localStorage.getItem('transportRequests') || '[]');
    if (transportRequests.length === 0) {
        const sampleRequests = [
            {
                id: 1,
                from: 'Karnataka',
                to: 'Maharashtra',
                cropId: 1,
                cropName: 'Finger Millet (Ragi)',
                quantity: 100,
                unit: 'kg',
                status: 'pending',
                createdAt: new Date().toISOString()
            }
        ];

        localStorage.setItem('transportRequests', JSON.stringify(sampleRequests));
    }
}

// Initialize sample data on page load
document.addEventListener('DOMContentLoaded', initializeSampleData);
