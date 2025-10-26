# 🌾 Shree Anna Platform - Enhanced Edition

A comprehensive digital marketplace web application for millet and pulses trading, connecting farmers, FPOs, SHGs, transporters, dealers, startups, processors, and consumers with advanced features and modern functionality.

## 🚀 Enhanced Features

### 🌟 New Advanced Features

#### 🌾 1. Crop Price Prediction System
- **AI-powered price prediction** based on historical data and market trends
- **Dynamic price suggestions** for farmers when adding crops
- **Market trend analysis** with visual indicators
- **Location-based pricing** recommendations

#### 📊 2. Advanced Analytics Dashboard
- **Interactive charts** using Chart.js for sales and revenue data
- **Real-time analytics** with customizable time periods (7, 30, 90 days)
- **Sales performance** tracking by crop type
- **Revenue trends** visualization
- **Top-performing crops** analysis

#### 🌤️ 3. Weather Integration & Yield Recommendations
- **Real-time weather data** integration (OpenWeatherMap API ready)
- **Smart yield recommendations** based on weather conditions
- **Seasonal crop suggestions** for optimal farming
- **Weather-based millet type recommendations**

#### 🗺️ 4. Interactive Maps (Leaflet.js)
- **Location-based services** for transporters and dealers
- **Interactive maps** showing nearby buyers and sellers
- **Route optimization** for delivery planning
- **Geographic crop distribution** visualization

#### 🛒 5. Advanced Shopping Cart System
- **Persistent cart** with LocalStorage
- **Real-time cart updates** with quantity controls
- **Cart widget** with item count display
- **Checkout simulation** with multiple payment options

#### 📈 6. Order History & Tracking
- **Comprehensive order history** for all user roles
- **Order status tracking** (Pending → Confirmed → Delivered)
- **Delivery timeline** visualization
- **Order analytics** and reporting

#### 🚚 7. Delivery Tracking System
- **Real-time delivery status** updates
- **Step-by-step tracking** (Pending → In Transit → Delivered)
- **Transporter assignment** system
- **Delivery notifications** for all parties

#### 🧾 8. Invoice Generation (jsPDF)
- **Automated invoice generation** for completed orders
- **Professional PDF invoices** with company branding
- **Order details** and payment information
- **Download and print** functionality

#### 🔐 9. Enhanced Security Features
- **Forgot password** functionality with LocalStorage simulation
- **Security questions** for password reset
- **Session management** improvements
- **User profile** security enhancements

#### 🔔 10. Advanced Notifications System
- **Real-time notifications** for all platform activities
- **Notification categories** (Orders, Messages, Price Updates)
- **Unread notification** badges and counters
- **Notification history** and management

#### 👤 11. Comprehensive Profile Management
- **Enhanced user profiles** with role-specific information
- **Profile picture** upload (Base64 simulation)
- **Contact information** management
- **Professional details** and specializations

#### 💬 12. Real-time Chat System
- **Role-based messaging** between all user types
- **Chat history** persistence with LocalStorage
- **Real-time message** delivery simulation
- **Contact management** and status indicators

#### 🌙 13. Dark/Light Mode Toggle
- **Theme switching** with persistent preferences
- **Smooth transitions** between themes
- **User preference** storage
- **System-wide theme** application

#### 🌐 14. Multi-Language Support
- **English, Hindi, and Marathi** language support
- **Dynamic language switching** without page reload
- **Comprehensive translations** for all UI elements
- **Language preference** persistence

#### 📷 15. Image Upload System
- **Drag-and-drop** image upload functionality
- **Base64 encoding** for image storage
- **Image preview** and management
- **File validation** and error handling

#### 🔍 16. Enhanced Search & Filter
- **Smart search suggestions** with autocomplete
- **Advanced filtering** by multiple criteria
- **Search history** and saved searches
- **Filter tags** and quick clear options

#### 💳 17. Simulated Payment Gateway
- **Multiple payment methods** (UPI, Card, Wallet)
- **Payment processing** simulation
- **Transaction history** tracking
- **Payment confirmation** system

### Core Functionality
- **Role-based Authentication**: Separate dashboards for farmers, dealers, transporters, service providers, and admins
- **Digital Marketplace**: Unified view of millet products and crops with advanced search and filtering
- **Traceability System**: Complete supply chain tracking from farm to consumer
- **LocalStorage Data Management**: Client-side data storage with CRUD operations
- **Responsive Design**: Mobile-friendly interface with millet-inspired color scheme

### User Roles & Dashboards

#### 🌱 Farmer Dashboard
- Add and manage millet crops (name, quantity, price, location, quality)
- View buyer requests and analytics
- Edit/Delete crop entries
- Track sales and revenue

#### 🏪 Dealer/Buyer Dashboard
- Browse and filter available crops
- Advanced search by millet type, location, price, quality
- Place orders and manage purchases
- Favorite farmers and track order history

#### 🚛 Transporter Dashboard
- View available transport requests
- Accept and manage delivery assignments
- Update delivery status (picked up, in transit, delivered)
- Track earnings and delivery history

#### 🏭 Service Provider Dashboard
- List value-added millet products
- Upload product details with certifications
- Source raw materials from farmers
- Partner with farmers for supply agreements

#### 👨‍💼 Admin Dashboard
- User management and approval system
- Platform statistics and analytics
- Data export and system management
- Traceability overview and monitoring

### 🌾 Millet Types Supported
- Finger Millet (Ragi)
- Pearl Millet (Bajra)
- Foxtail Millet
- Little Millet
- Kodo Millet
- Proso Millet
- Barnyard Millet

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with Flexbox/Grid layouts
- **Data Storage**: Browser LocalStorage
- **Icons**: Font Awesome 6.0
- **Responsive**: Mobile-first design approach

## 📁 Project Structure

```
Shree_Anna/
├── index.html                 # Homepage
├── marketplace.html           # Marketplace page
├── about.html                 # About page
├── contact.html               # Contact page
├── dashboard-farmer.html      # Farmer dashboard
├── dashboard-dealer.html      # Dealer dashboard
├── dashboard-transporter.html # Transporter dashboard
├── dashboard-service.html     # Service provider dashboard
├── dashboard-admin.html       # Admin dashboard
├── styles/
│   ├── main.css              # Main stylesheet
│   └── auth.css              # Authentication styles
├── js/
│   ├── auth.js               # Authentication system
│   ├── main.js               # Main JavaScript utilities
│   ├── farmer-dashboard.js   # Farmer dashboard logic
│   ├── dealer-dashboard.js   # Dealer dashboard logic
│   ├── transporter-dashboard.js # Transporter dashboard logic
│   ├── service-dashboard.js  # Service provider dashboard logic
│   ├── admin-dashboard.js     # Admin dashboard logic
│   ├── marketplace.js        # Marketplace functionality
│   └── contact.js            # Contact form handling
└── README.md                 # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely client-side

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. Start exploring the platform!

### Sample Data
The platform comes with pre-loaded sample data including:
- Sample users for each role
- Sample millet crops
- Sample processed products
- Sample transport requests

## 🎯 Key Features

### Authentication System
- Role-based registration and login
- Session management with LocalStorage
- Automatic redirection to appropriate dashboard

### Marketplace
- Advanced search and filtering
- Category-based browsing (crops vs products)
- Sorting options (price, date, quantity, name)
- Product details and seller information

### Traceability
- Complete supply chain visibility
- Farm-to-table tracking
- Quality assurance and certifications
- Transparent pricing and sourcing

### Data Management
- LocalStorage-based CRUD operations
- Data export functionality
- Sample data initialization
- Cross-role data sharing

## 🎨 Design Features

### Color Scheme
- **Primary**: Earthy brown (#8B4513)
- **Secondary**: Golden brown (#A0522D)
- **Accent**: Forest green (#228B22)
- **Background**: Cream (#F5DEB3)

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interfaces
- Optimized for all screen sizes

## 📱 Usage Guide

### For Farmers
1. Register as a farmer
2. Add your millet crops with details
3. Set prices and quality specifications
4. Respond to buyer requests
5. Track your sales and revenue

### For Dealers/Buyers
1. Register as a dealer
2. Browse available crops and products
3. Use filters to find specific items
4. Place orders and contact sellers
5. Manage your purchase history

### For Transporters
1. Register as a transporter
2. View available transport requests
3. Accept delivery assignments
4. Update delivery status
5. Track your earnings

### For Service Providers
1. Register as a service provider
2. List your processed products
3. Source raw materials from farmers
4. Partner with farmers for supply
5. Manage your product catalog

### For Admins
1. Login with admin credentials
2. Manage users and platform data
3. View analytics and statistics
4. Export data and manage system

## 🔧 Customization

### Adding New Millet Types
Edit the dropdown options in the relevant forms to include new millet varieties.

### Modifying Color Scheme
Update the CSS variables in `styles/main.css` to change the color scheme.

### Adding New Features
The modular JavaScript structure makes it easy to add new functionality to existing dashboards.

## 📊 Sample Credentials

For testing purposes, use these sample accounts:

- **Farmer**: farmer@example.com / password
- **Dealer**: dealer@example.com / password
- **Transporter**: transporter@example.com / password
- **Service Provider**: service@example.com / password
- **Admin**: admin@example.com / password

## 🌟 Future Enhancements

- Mobile app development
- Payment gateway integration
- Real-time notifications
- Advanced analytics dashboard
- Multi-language support
- API integration for external services

## 📄 License

This project is created for educational and demonstration purposes. Feel free to use and modify as needed.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## 📞 Support

For support or questions, please contact us through the platform's contact form or email support@shreeannaplatform.com.

---

**Shree Anna Platform** - Connecting the millet value chain for sustainable agriculture and nutrition security. 🌾
