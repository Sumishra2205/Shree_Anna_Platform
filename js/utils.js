// Enhanced Utilities for Shree Anna Platform
class PlatformUtils {
    constructor() {
        this.translations = this.initializeTranslations();
        this.weatherAPIKey = 'demo'; // Replace with actual API key
        this.init();
    }

    init() {
        this.initializeTheme();
        this.initializeLanguage();
        this.setupGlobalEventListeners();
    }

    // Initialize translations for multi-language support
    initializeTranslations() {
        return {
            en: {
                // Navigation
                home: 'Home',
                marketplace: 'Marketplace',
                about: 'About',
                contact: 'Contact',
                login: 'Login',
                register: 'Register',
                logout: 'Logout',
                
                // Dashboard
                dashboard: 'Dashboard',
                analytics: 'Analytics',
                profile: 'Profile',
                notifications: 'Notifications',
                messages: 'Messages',
                
                // Common
                save: 'Save',
                cancel: 'Cancel',
                edit: 'Edit',
                delete: 'Delete',
                view: 'View',
                add: 'Add',
                search: 'Search',
                filter: 'Filter',
                clear: 'Clear',
                submit: 'Submit',
                loading: 'Loading...',
                
                // Roles
                farmer: 'Farmer',
                dealer: 'Dealer',
                transporter: 'Transporter',
                service: 'Service Provider',
                admin: 'Admin',
                
                // Status
                available: 'Available',
                sold: 'Sold',
                pending: 'Pending',
                confirmed: 'Confirmed',
                delivered: 'Delivered',
                inTransit: 'In Transit',
                
                // Notifications
                newOrder: 'New order received',
                orderConfirmed: 'Order confirmed',
                orderDelivered: 'Order delivered',
                newMessage: 'New message',
                priceUpdate: 'Price updated',
                cropSold: 'Crop sold successfully'
            },
            hi: {
                // Navigation
                home: 'होम',
                marketplace: 'मार्केटप्लेस',
                about: 'हमारे बारे में',
                contact: 'संपर्क',
                login: 'लॉगिन',
                register: 'रजिस्टर',
                logout: 'लॉगआउट',
                
                // Dashboard
                dashboard: 'डैशबोर्ड',
                analytics: 'विश्लेषण',
                profile: 'प्रोफाइल',
                notifications: 'सूचनाएं',
                messages: 'संदेश',
                
                // Common
                save: 'सहेजें',
                cancel: 'रद्द करें',
                edit: 'संपादित करें',
                delete: 'हटाएं',
                view: 'देखें',
                add: 'जोड़ें',
                search: 'खोजें',
                filter: 'फिल्टर',
                clear: 'साफ करें',
                submit: 'जमा करें',
                loading: 'लोड हो रहा है...',
                
                // Roles
                farmer: 'किसान',
                dealer: 'डीलर',
                transporter: 'ट्रांसपोर्टर',
                service: 'सेवा प्रदाता',
                admin: 'एडमिन',
                
                // Status
                available: 'उपलब्ध',
                sold: 'बेचा गया',
                pending: 'लंबित',
                confirmed: 'पुष्टि की गई',
                delivered: 'डिलीवर किया गया',
                inTransit: 'ट्रांजिट में',
                
                // Notifications
                newOrder: 'नया ऑर्डर मिला',
                orderConfirmed: 'ऑर्डर पुष्टि की गई',
                orderDelivered: 'ऑर्डर डिलीवर किया गया',
                newMessage: 'नया संदेश',
                priceUpdate: 'कीमत अपडेट की गई',
                cropSold: 'फसल सफलतापूर्वक बेची गई'
            },
            mr: {
                // Navigation
                home: 'मुख्यपृष्ठ',
                marketplace: 'बाजार',
                about: 'आमच्याबद्दल',
                contact: 'संपर्क',
                login: 'लॉगिन',
                register: 'नोंदणी',
                logout: 'लॉगआउट',
                
                // Dashboard
                dashboard: 'डॅशबोर्ड',
                analytics: 'विश्लेषण',
                profile: 'प्रोफाइल',
                notifications: 'सूचना',
                messages: 'संदेश',
                
                // Common
                save: 'जतन करा',
                cancel: 'रद्द करा',
                edit: 'संपादित करा',
                delete: 'हटवा',
                view: 'पहा',
                add: 'जोडा',
                search: 'शोधा',
                filter: 'फिल्टर',
                clear: 'साफ करा',
                submit: 'सबमिट करा',
                loading: 'लोड होत आहे...',
                
                // Roles
                farmer: 'शेतकरी',
                dealer: 'डीलर',
                transporter: 'वाहतूक',
                service: 'सेवा प्रदाता',
                admin: 'एडमिन',
                
                // Status
                available: 'उपलब्ध',
                sold: 'विकले',
                pending: 'प्रलंबित',
                confirmed: 'पुष्टीकृत',
                delivered: 'वितरित',
                inTransit: 'प्रवासात',
                
                // Notifications
                newOrder: 'नवीन ऑर्डर मिळाले',
                orderConfirmed: 'ऑर्डर पुष्टीकृत',
                orderDelivered: 'ऑर्डर वितरित',
                newMessage: 'नवीन संदेश',
                priceUpdate: 'किंमत अपडेट',
                cropSold: 'पीक यशस्वीरित्या विकले'
            }
        };
    }

    // Theme Management
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        document.body.classList.remove('dark-mode', 'light-mode');
        document.body.classList.add(theme + '-mode');
        localStorage.setItem('theme', theme);
        
        // Update theme toggle button if exists
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.innerHTML = theme === 'dark' ? 
                '<i class="fas fa-sun"></i>' : 
                '<i class="fas fa-moon"></i>';
        }
    }

    toggleTheme() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    // Language Management
    initializeLanguage() {
        const savedLanguage = localStorage.getItem('language') || 'en';
        this.setLanguage(savedLanguage);
    }

    setLanguage(lang) {
        localStorage.setItem('language', lang);
        this.currentLanguage = lang;
        this.translatePage();
    }

    translatePage() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.translations[this.currentLanguage]?.[key] || 
                              this.translations['en'][key] || key;
            element.textContent = translation;
        });
    }

    translate(key) {
        return this.translations[this.currentLanguage]?.[key] || 
               this.translations['en'][key] || key;
    }

    // Price Prediction System
    predictPrice(cropType, quality, location) {
        // Get historical data from localStorage
        const crops = JSON.parse(localStorage.getItem('crops') || '[]');
        const recentCrops = crops.filter(crop => 
            crop.type === cropType && 
            crop.quality === quality &&
            crop.status === 'sold' &&
            new Date(crop.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        );

        if (recentCrops.length === 0) {
            // Use default prices if no historical data
            const defaultPrices = {
                'Finger Millet': { 'Premium': 50, 'Good': 40, 'Organic': 60, 'Fair': 35 },
                'Pearl Millet': { 'Premium': 40, 'Good': 32, 'Organic': 48, 'Fair': 28 },
                'Foxtail Millet': { 'Premium': 55, 'Good': 45, 'Organic': 65, 'Fair': 40 },
                'Little Millet': { 'Premium': 45, 'Good': 35, 'Organic': 55, 'Fair': 30 },
                'Kodo Millet': { 'Premium': 42, 'Good': 34, 'Organic': 50, 'Fair': 30 },
                'Proso Millet': { 'Premium': 38, 'Good': 30, 'Organic': 45, 'Fair': 25 },
                'Barnyard Millet': { 'Premium': 35, 'Good': 28, 'Organic': 42, 'Fair': 25 }
            };
            return defaultPrices[cropType]?.[quality] || 40;
        }

        // Calculate average price from recent sales
        const totalPrice = recentCrops.reduce((sum, crop) => sum + crop.price, 0);
        const averagePrice = totalPrice / recentCrops.length;

        // Add some variation based on demand (simplified)
        const demandFactor = recentCrops.length > 5 ? 1.1 : 0.9;
        return Math.round(averagePrice * demandFactor);
    }

    // Weather Integration
    async getWeatherData(location) {
        try {
            // For demo purposes, return mock weather data
            // In production, use actual weather API
            const mockWeather = {
                temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
                humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
                rainfall: Math.floor(Math.random() * 20), // 0-20mm
                windSpeed: Math.floor(Math.random() * 10) + 5, // 5-15 km/h
                condition: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy'][Math.floor(Math.random() * 4)]
            };
            return mockWeather;
        } catch (error) {
            console.error('Weather API error:', error);
            return null;
        }
    }

    getYieldRecommendation(weather, season) {
        const recommendations = [];
        
        if (weather.rainfall > 15) {
            recommendations.push('Pearl Millet - Good for high rainfall');
        }
        if (weather.temperature > 30) {
            recommendations.push('Finger Millet - Heat tolerant');
        }
        if (weather.humidity < 50) {
            recommendations.push('Foxtail Millet - Drought resistant');
        }
        
        return recommendations.length > 0 ? recommendations : ['All millet types suitable'];
    }

    // Image Upload (Base64)
    handleImageUpload(file, callback) {
        if (!file || !file.type.startsWith('image/')) {
            showNotification('Please select a valid image file', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            callback(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    // Cart Management
    addToCart(itemId, itemType, quantity = 1) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === itemId && item.type === itemType);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            // Get item details based on type
            let itemDetails = {};
            if (itemType === 'crop') {
                const crops = JSON.parse(localStorage.getItem('crops') || '[]');
                const crop = crops.find(c => c.id === itemId);
                if (crop) {
                    itemDetails = {
                        id: itemId,
                        type: itemType,
                        name: crop.name,
                        price: crop.price,
                        unit: crop.unit,
                        sellerName: crop.farmerName,
                        image: crop.image,
                        quantity: quantity
                    };
                }
            } else if (itemType === 'product') {
                const products = JSON.parse(localStorage.getItem('products') || '[]');
                const product = products.find(p => p.id === itemId);
                if (product) {
                    itemDetails = {
                        id: itemId,
                        type: itemType,
                        name: product.name,
                        price: product.price,
                        unit: product.unit,
                        sellerName: product.providerName,
                        image: product.image,
                        quantity: quantity
                    };
                }
            }
            
            if (Object.keys(itemDetails).length > 0) {
                cart.push(itemDetails);
            }
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartWidget();
        showNotification('Item added to cart!', 'success');
    }

    updateCartWidget() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const cartWidget = document.getElementById('cartWidget');
        if (cartWidget) {
            const countElement = cartWidget.querySelector('.cart-count');
            if (countElement) {
                countElement.textContent = totalItems;
            }
        }
    }

    // Notifications System
    addNotification(userId, type, message, data = {}) {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const notification = {
            id: Date.now(),
            userId: userId,
            type: type,
            message: message,
            data: data,
            read: false,
            createdAt: new Date().toISOString()
        };
        
        notifications.push(notification);
        localStorage.setItem('notifications', JSON.stringify(notifications));
        this.updateNotificationBadge(userId);
    }

    getNotifications(userId) {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        return notifications.filter(n => n.userId === userId);
    }

    markNotificationAsRead(notificationId) {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const notification = notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            localStorage.setItem('notifications', JSON.stringify(notifications));
        }
    }

    updateNotificationBadge(userId) {
        const notifications = this.getNotifications(userId);
        const unreadCount = notifications.filter(n => !n.read).length;
        
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }

    // Chat System
    sendMessage(senderId, receiverId, message) {
        const chats = JSON.parse(localStorage.getItem('chats') || '[]');
        const chatMessage = {
            id: Date.now(),
            senderId: senderId,
            receiverId: receiverId,
            message: message,
            timestamp: new Date().toISOString(),
            read: false
        };
        
        chats.push(chatMessage);
        localStorage.setItem('chats', JSON.stringify(chats));
        
        // Add notification for receiver
        this.addNotification(receiverId, 'message', 'New message received', { senderId });
    }

    getChatHistory(userId1, userId2) {
        const chats = JSON.parse(localStorage.getItem('chats') || '[]');
        return chats.filter(chat => 
            (chat.senderId === userId1 && chat.receiverId === userId2) ||
            (chat.senderId === userId2 && chat.receiverId === userId1)
        ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }

    // Order Management
    createOrder(buyerId, sellerId, items, totalAmount) {
        const orders = JSON.parse(localStorage.getItem('orders') || [];
        const order = {
            id: Date.now(),
            buyerId: buyerId,
            sellerId: sellerId,
            items: items,
            totalAmount: totalAmount,
            status: 'pending',
            createdAt: new Date().toISOString(),
            paymentStatus: 'pending'
        };
        
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Add notifications
        this.addNotification(sellerId, 'order', 'New order received', { orderId: order.id });
        this.addNotification(buyerId, 'order', 'Order placed successfully', { orderId: order.id });
        
        return order;
    }

    // Invoice Generation
    generateInvoice(orderId) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const order = orders.find(o => o.id === orderId);
        if (!order) return null;

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const buyer = users.find(u => u.id === order.buyerId);
        const seller = users.find(u => u.id === order.sellerId);

        return {
            invoiceNumber: `INV-${orderId}`,
            date: order.createdAt,
            buyer: buyer,
            seller: seller,
            items: order.items,
            totalAmount: order.totalAmount,
            status: order.status
        };
    }

    // Search and Filter
    searchItems(query, items, fields = ['name', 'description']) {
        if (!query) return items;
        
        const searchTerm = query.toLowerCase();
        return items.filter(item => 
            fields.some(field => 
                item[field] && item[field].toLowerCase().includes(searchTerm)
            )
        );
    }

    filterItems(items, filters) {
        return items.filter(item => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                if (typeof value === 'string') {
                    return item[key] && item[key].toLowerCase().includes(value.toLowerCase());
                }
                if (typeof value === 'number') {
                    return item[key] >= value;
                }
                return item[key] === value;
            });
        });
    }

    // Utility Functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatPrice(price) {
        return `₹${price.toLocaleString('en-IN')}`;
    }

    generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }

    // Setup global event listeners
    setupGlobalEventListeners() {
        // Theme toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('#themeToggle')) {
                this.toggleTheme();
            }
        });

        // Language selector
        document.addEventListener('change', (e) => {
            if (e.target.id === 'languageSelector') {
                this.setLanguage(e.target.value);
            }
        });

        // Notification bell
        document.addEventListener('click', (e) => {
            if (e.target.closest('.notification-bell')) {
                this.toggleNotificationDropdown();
            }
        });

        // Cart widget
        document.addEventListener('click', (e) => {
            if (e.target.closest('#cartWidget')) {
                this.showCartModal();
            }
        });
    }

    toggleNotificationDropdown() {
        const dropdown = document.querySelector('.notification-dropdown');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
    }

    showCartModal() {
        const modal = document.getElementById('cartModal');
        if (modal) {
            modal.style.display = 'block';
            this.displayCartItems();
        }
    }

    displayCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const cartItems = document.getElementById('cartItems');
        
        if (!cartItems) return;

        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty</p>';
            return;
        }

        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${this.formatPrice(item.price)}/${item.unit}</p>
                    <p>Seller: ${item.sellerName}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="platformUtils.updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="platformUtils.updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="btn btn-outline btn-small" onclick="platformUtils.removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Update total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalElement = document.getElementById('cartTotal');
        if (totalElement) {
            totalElement.textContent = this.formatPrice(total);
        }
    }

    updateCartQuantity(itemId, newQuantity) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const item = cart.find(i => i.id === itemId);
        
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(itemId);
            } else {
                item.quantity = newQuantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                this.displayCartItems();
                this.updateCartWidget();
            }
        }
    }

    removeFromCart(itemId) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        this.displayCartItems();
        this.updateCartWidget();
        showNotification('Item removed from cart', 'info');
    }
}

// Initialize platform utilities
const platformUtils = new PlatformUtils();

// Export for use in other files
window.PlatformUtils = PlatformUtils;
window.platformUtils = platformUtils;
