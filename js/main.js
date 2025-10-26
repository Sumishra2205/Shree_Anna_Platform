// Enhanced Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize platform utilities
    if (typeof platformUtils !== 'undefined') {
        platformUtils.init();
    }

    // Mobile navigation toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Enhanced navigation with theme and language controls
    initializeNavigationControls();

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Enhanced scroll animations
    initializeScrollAnimations();

    // Enhanced search with suggestions
    initializeSearchFunctionality();

    // Initialize cart system
    initializeCartSystem();

    // Initialize notifications
    initializeNotifications();

    // Initialize image upload functionality
    initializeImageUpload();

    // Initialize weather widget
    initializeWeatherWidget();

    // Initialize map functionality
    initializeMapFunctionality();

    // Initialize analytics
    initializeAnalytics();
});

// Initialize navigation controls (theme, language, notifications)
function initializeNavigationControls() {
    // Add theme toggle to navbar
    const navMenu = document.getElementById('navMenu');
    if (navMenu && !document.getElementById('themeToggle')) {
        const themeToggle = document.createElement('button');
        themeToggle.id = 'themeToggle';
        themeToggle.className = 'btn btn-outline';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.onclick = function() { 
            toggleTheme(); 
        };
        navMenu.appendChild(themeToggle);
    }

    // Add language selector
    if (navMenu && !document.getElementById('languageSelector')) {
        const languageSelector = document.createElement('select');
        languageSelector.id = 'languageSelector';
        languageSelector.className = 'language-selector';
        languageSelector.innerHTML = `
            <option value="en">🇺🇸 English</option>
            <option value="hi">🇮🇳 हिन्दी</option>
            <option value="mr">🇮🇳 मराठी</option>
            <option value="od">🇮🇳 ଓଡ଼ିଆ</option>
        `;
        navMenu.appendChild(languageSelector);
        
        // Initialize language functionality
        initializeLanguageSystem();
    }

    // Add notification bell
    if (navMenu && !document.querySelector('.notification-bell')) {
        const notificationBell = document.createElement('div');
        notificationBell.className = 'notification-bell';
        notificationBell.innerHTML = `
            <i class="fas fa-bell"></i>
            <span class="notification-badge" style="display: none;">0</span>
        `;
        navMenu.appendChild(notificationBell);
    }

    // Add cart widget
    if (!document.getElementById('cartWidget')) {
        const cartWidget = document.createElement('div');
        cartWidget.id = 'cartWidget';
        cartWidget.className = 'cart-widget';
        cartWidget.innerHTML = `
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-count">0</span>
        `;
        document.body.appendChild(cartWidget);
    }

    // Initialize theme system after creating toggle button
    setTimeout(() => {
        initializeThemeSystem();
    }, 100);
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe animated elements
    const animatedElements = document.querySelectorAll('.feature-card, .benefit, .product-card, .marketplace-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize enhanced search functionality
function initializeSearchFunctionality() {
    const searchInputs = document.querySelectorAll('input[type="search"], #marketplaceSearch');
    
    searchInputs.forEach(input => {
        const container = input.closest('.search-container') || input.parentElement;
        
        // Create suggestions container
        if (!container.querySelector('.search-suggestions')) {
            const suggestions = document.createElement('div');
            suggestions.className = 'search-suggestions';
            container.appendChild(suggestions);
        }

        input.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            if (query.length < 2) {
                hideSuggestions(container);
                return;
            }

            // Get suggestions based on context
            const suggestions = getSearchSuggestions(query, this.dataset.context);
            showSuggestions(container, suggestions);
        });

        input.addEventListener('blur', function() {
            setTimeout(() => hideSuggestions(container), 200);
        });
    });
}

// Get search suggestions based on context
function getSearchSuggestions(query, context) {
    const suggestions = [];
    
    if (context === 'marketplace') {
        const crops = JSON.parse(localStorage.getItem('crops') || '[]');
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        
        [...crops, ...products].forEach(item => {
            if (item.name.toLowerCase().includes(query)) {
                suggestions.push({
                    text: item.name,
                    type: item.type || 'crop',
                    id: item.id
                });
            }
        });
    }
    
    return suggestions.slice(0, 5); // Limit to 5 suggestions
}

// Show search suggestions
function showSuggestions(container, suggestions) {
    const suggestionsEl = container.querySelector('.search-suggestions');
    if (!suggestionsEl) return;

    if (suggestions.length === 0) {
        hideSuggestions(container);
        return;
    }

    suggestionsEl.innerHTML = suggestions.map(suggestion => `
        <div class="suggestion-item" onclick="selectSuggestion('${suggestion.text}')">
            <strong>${suggestion.text}</strong>
            <span class="suggestion-type">${suggestion.type}</span>
        </div>
    `).join('');

    suggestionsEl.style.display = 'block';
}

// Hide search suggestions
function hideSuggestions(container) {
    const suggestionsEl = container.querySelector('.search-suggestions');
    if (suggestionsEl) {
        suggestionsEl.style.display = 'none';
    }
}

// Select suggestion
function selectSuggestion(text) {
    const activeInput = document.activeElement;
    if (activeInput && activeInput.type === 'search') {
        activeInput.value = text;
        activeInput.dispatchEvent(new Event('input'));
    }
}

// Initialize cart system
function initializeCartSystem() {
    // Create cart modal if it doesn't exist
    if (!document.getElementById('cartModal')) {
        const cartModal = document.createElement('div');
        cartModal.id = 'cartModal';
        cartModal.className = 'cart-modal';
        cartModal.innerHTML = `
            <div class="cart-content">
                <div class="cart-header">
                    <h2>Shopping Cart</h2>
                    <button class="close" onclick="closeCartModal()">&times;</button>
                </div>
                <div id="cartItems"></div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <strong>Total: <span id="cartTotal">₹0</span></strong>
                    </div>
                    <button class="btn btn-primary" onclick="proceedToCheckout()">
                        <i class="fas fa-credit-card"></i> Proceed to Checkout
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(cartModal);
    }

    // Update cart widget on page load
    if (typeof platformUtils !== 'undefined') {
        platformUtils.updateCartWidget();
    }
}

// Initialize notifications
function initializeNotifications() {
    const currentUser = DataManager.getCurrentUser();
    if (currentUser && typeof platformUtils !== 'undefined') {
        platformUtils.updateNotificationBadge(currentUser.id);
    }
}

// Initialize image upload functionality
function initializeImageUpload() {
    const uploadAreas = document.querySelectorAll('.image-upload');
    
    uploadAreas.forEach(area => {
        // Drag and drop functionality
        area.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        area.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });

        area.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleImageUpload(files[0], this);
            }
        });

        // Click to upload
        area.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function(e) {
                if (e.target.files.length > 0) {
                    handleImageUpload(e.target.files[0], area);
                }
            };
            input.click();
        });
    });
}

// Handle image upload
function handleImageUpload(file, uploadArea) {
    if (typeof platformUtils !== 'undefined') {
        platformUtils.handleImageUpload(file, function(base64) {
            // Update upload area with image
            uploadArea.innerHTML = `
                <img src="${base64}" class="uploaded-image" alt="Uploaded image">
                <button class="btn btn-outline btn-small" onclick="removeUploadedImage(this)">
                    <i class="fas fa-trash"></i> Remove
                </button>
            `;
            
            // Store base64 in a data attribute for form submission
            uploadArea.dataset.imageData = base64;
        });
    }
}

// Remove uploaded image
function removeUploadedImage(button) {
    const uploadArea = button.closest('.image-upload');
    uploadArea.innerHTML = `
        <div class="upload-icon">
            <i class="fas fa-cloud-upload-alt"></i>
        </div>
        <p>Click or drag to upload image</p>
    `;
    delete uploadArea.dataset.imageData;
}

// Initialize weather widget
function initializeWeatherWidget() {
    const weatherWidgets = document.querySelectorAll('.weather-widget');
    
    weatherWidgets.forEach(widget => {
        const location = widget.dataset.location || 'Bangalore';
        loadWeatherData(widget, location);
    });
}

// Load weather data
async function loadWeatherData(widget, location) {
    if (typeof platformUtils !== 'undefined') {
        const weather = await platformUtils.getWeatherData(location);
        if (weather) {
            widget.innerHTML = `
                <div class="weather-header">
                    <h3>${location}</h3>
                    <div class="weather-temp">${weather.temperature}°C</div>
                </div>
                <div class="weather-details">
                    <div class="weather-item">
                        <i class="fas fa-tint"></i>
                        <div>Humidity</div>
                        <div>${weather.humidity}%</div>
                    </div>
                    <div class="weather-item">
                        <i class="fas fa-cloud-rain"></i>
                        <div>Rainfall</div>
                        <div>${weather.rainfall}mm</div>
                    </div>
                    <div class="weather-item">
                        <i class="fas fa-wind"></i>
                        <div>Wind</div>
                        <div>${weather.windSpeed} km/h</div>
                    </div>
                </div>
                <div class="weather-recommendations">
                    <h4>Millet Recommendations:</h4>
                    <ul>
                        ${platformUtils.getYieldRecommendation(weather, 'current').map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    }
}

// Initialize map functionality
function initializeMapFunctionality() {
    const mapContainers = document.querySelectorAll('.map-container');
    
    mapContainers.forEach(container => {
        if (typeof L !== 'undefined') {
            // Initialize Leaflet map
            const map = L.map(container).setView([12.9716, 77.5946], 10); // Bangalore coordinates
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            // Add sample markers
            addSampleMarkers(map);
        }
    });
}

// Add sample markers to map
function addSampleMarkers(map) {
    const sampleLocations = [
        { lat: 12.9716, lng: 77.5946, name: 'Bangalore Market', type: 'market' },
        { lat: 12.9352, lng: 77.6245, name: 'Farmer Co-op', type: 'farmer' },
        { lat: 12.9856, lng: 77.5946, name: 'Processing Unit', type: 'processor' }
    ];
    
    sampleLocations.forEach(location => {
        const marker = L.marker([location.lat, location.lng]).addTo(map);
        marker.bindPopup(`
            <strong>${location.name}</strong><br>
            Type: ${location.type}
        `);
    });
}

// Initialize analytics
function initializeAnalytics() {
    // Load Chart.js if not already loaded
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = function() {
            initializeCharts();
        };
        document.head.appendChild(script);
    } else {
        initializeCharts();
    }
}

// Initialize charts
function initializeCharts() {
    const chartContainers = document.querySelectorAll('.chart-container');
    
    chartContainers.forEach(container => {
        const ctx = container.querySelector('canvas');
        if (ctx) {
            const chartType = container.dataset.chartType || 'bar';
            const chartData = getChartData(container.dataset.chartData);
            
            new Chart(ctx, {
                type: chartType,
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    });
}

// Get chart data based on type
function getChartData(dataType) {
    switch (dataType) {
        case 'sales':
            return {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Sales',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: 'rgba(139, 69, 19, 0.2)',
                    borderColor: 'rgba(139, 69, 19, 1)',
                    borderWidth: 1
                }]
            };
        case 'revenue':
            return {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [{
                    label: 'Revenue',
                    data: [10000, 15000, 12000, 18000],
                    backgroundColor: 'rgba(34, 139, 34, 0.2)',
                    borderColor: 'rgba(34, 139, 34, 1)',
                    borderWidth: 1
                }]
            };
        default:
            return {
                labels: ['Sample'],
                datasets: [{
                    label: 'Data',
                    data: [1],
                    backgroundColor: 'rgba(139, 69, 19, 0.2)'
                }]
            };
    }
}

// Global functions for cart and checkout
function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'warning');
        return;
    }
    
    // Show payment modal
    showPaymentModal();
}

function showPaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        paymentModal.style.display = 'block';
    } else {
        createPaymentModal();
    }
}

function createPaymentModal() {
    const modal = document.createElement('div');
    modal.id = 'paymentModal';
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="payment-content">
            <h2>Payment Options</h2>
            <div class="payment-methods">
                <div class="payment-method" onclick="selectPaymentMethod('upi')">
                    <i class="fas fa-mobile-alt"></i>
                    <div>UPI</div>
                </div>
                <div class="payment-method" onclick="selectPaymentMethod('card')">
                    <i class="fas fa-credit-card"></i>
                    <div>Card</div>
                </div>
                <div class="payment-method" onclick="selectPaymentMethod('wallet')">
                    <i class="fas fa-wallet"></i>
                    <div>Wallet</div>
                </div>
            </div>
            <div class="payment-actions">
                <button class="btn btn-outline" onclick="closePaymentModal()">Cancel</button>
                <button class="btn btn-primary" onclick="processPayment()">Pay Now</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function selectPaymentMethod(method) {
    document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('selected'));
    event.target.closest('.payment-method').classList.add('selected');
    document.getElementById('selectedPaymentMethod').value = method;
}

function processPayment() {
    const selectedMethod = document.querySelector('.payment-method.selected');
    if (!selectedMethod) {
        showNotification('Please select a payment method', 'error');
        return;
    }
    
    // Simulate payment processing
    showNotification('Processing payment...', 'info');
    
    setTimeout(() => {
        showNotification('Payment successful!', 'success');
        closePaymentModal();
        closeCartModal();
        
        // Clear cart
        localStorage.removeItem('cart');
        if (typeof platformUtils !== 'undefined') {
            platformUtils.updateCartWidget();
        }
    }, 2000);
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Filter functionality
function applyFilters() {
    const typeFilter = document.getElementById('typeFilter')?.value;
    const locationFilter = document.getElementById('locationFilter')?.value;
    const priceMin = document.getElementById('priceMin')?.value;
    const priceMax = document.getElementById('priceMax')?.value;
    
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        let show = true;
        
        // Type filter
        if (typeFilter && typeFilter !== '') {
            const cardType = card.dataset.type;
            if (cardType !== typeFilter) {
                show = false;
            }
        }
        
        // Location filter
        if (locationFilter && locationFilter !== '') {
            const cardLocation = card.querySelector('.product-location').textContent.toLowerCase();
            if (!cardLocation.includes(locationFilter.toLowerCase())) {
                show = false;
            }
        }
        
        // Price filter
        if (priceMin || priceMax) {
            const priceText = card.querySelector('.product-price').textContent;
            const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
            
            if (priceMin && price < parseFloat(priceMin)) {
                show = false;
            }
            if (priceMax && price > parseFloat(priceMax)) {
                show = false;
            }
        }
        
        card.style.display = show ? 'block' : 'none';
    });
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatPrice(price) {
    return `₹${price.toLocaleString('en-IN')}`;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// Data management functions
class DataManager {
    static getCrops() {
        return JSON.parse(localStorage.getItem('crops') || '[]');
    }

    static saveCrops(crops) {
        localStorage.setItem('crops', JSON.stringify(crops));
    }

    static getProducts() {
        return JSON.parse(localStorage.getItem('products') || '[]');
    }

    static saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products));
    }

    static getTransportRequests() {
        return JSON.parse(localStorage.getItem('transportRequests') || '[]');
    }

    static saveTransportRequests(requests) {
        localStorage.setItem('transportRequests', JSON.stringify(requests));
    }

    static getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    static saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    static getCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    }
}

// Initialize language system
function initializeLanguageSystem() {
    // Load translations if not already loaded
    if (typeof translations === 'undefined') {
        const script = document.createElement('script');
        script.src = 'js/translations.js';
        script.onload = function() {
            setupLanguageSystem();
        };
        document.head.appendChild(script);
    } else {
        setupLanguageSystem();
    }
}

// Setup language system
function setupLanguageSystem() {
    const langSelect = document.getElementById('languageSelector');
    if (!langSelect) return;

    // Get saved language or default to English
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    langSelect.value = savedLang;

    // Update language on change
    langSelect.addEventListener('change', function(e) {
        updateLanguage(e.target.value);
    });

    // Initial language update
    updateLanguage(savedLang);
}

// Update language function
function updateLanguage(lang) {
    if (typeof translations === 'undefined') return;
    
    // Save language preference
    localStorage.setItem('selectedLanguage', lang);
    
    // Update all elements with data-translate attribute
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Update page title
    if (translations[lang] && translations[lang].title) {
        document.title = translations[lang].title;
    }

    // Update form placeholders
    const placeholders = document.querySelectorAll('[data-placeholder]');
    placeholders.forEach(el => {
        const key = el.getAttribute('data-placeholder');
        if (translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });
}

// Toggle theme function
function toggleTheme() {
    document.body.classList.toggle('dark');
    const newTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

// Update theme icon
function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// Initialize theme system
function initializeThemeSystem() {
    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark', savedTheme === 'dark');
    
    // Update toggle icon if it exists
    updateThemeIcon(savedTheme);
}

// Initialize theme system on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeThemeSystem();
});

// Export for use in other files
window.DataManager = DataManager;
window.showNotification = showNotification;
window.formatDate = formatDate;
window.formatPrice = formatPrice;
window.updateLanguage = updateLanguage;
window.toggleTheme = toggleTheme;
