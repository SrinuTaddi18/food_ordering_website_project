# Food Delivery App - MERN Stack

A full-stack food delivery application built with MongoDB, Express, React, and Node.js. This app allows users to browse food items, add them to cart, place orders, and allows admin users to manage orders and food items.

## Tech Stack

- **Frontend**: React, React Router, Bootstrap, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Features

- ✅ User authentication (Login/Register)
- ✅ Browse food items with search functionality
- ✅ Add items to cart with quantity management
- ✅ Place orders with delivery address
- ✅ View order history
- ✅ Admin panel for managing food items
- ✅ Admin panel for managing orders
- ✅ Modern, responsive UI with dark theme

## Project Structure

```
Food_Ordering_Webiste/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Food.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── food.js
│   │   ├── orders.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── Navbar.css
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Home.css
│   │   │   ├── Cart.js
│   │   │   ├── Cart.css
│   │   │   ├── Orders.js
│   │   │   ├── Orders.css
│   │   │   ├── Login.js
│   │   │   ├── Login.css
│   │   │   ├── Admin.js
│   │   │   └── Admin.css
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Food_Ordering_Webiste
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up Environment Variables**

   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/fooddelivery
   JWT_SECRET=your-secret-key-change-in-production
   ```

   Create a `.env` file in the `frontend` directory (optional):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Start MongoDB**

   Make sure MongoDB is running on your system. If using MongoDB Atlas, update the `MONGO_URI` in the `.env` file.

6. **Seed the Database (Optional)**

   Populate the database with sample food items and test users:
   ```bash
   cd backend
   npm run seed
   ```
   
   This will create:
   - Admin user: `admin@fooddelivery.com` / `admin123`
   - Test user: `user@fooddelivery.com` / `user123`
   - 10 sample food items

7. **Run the Application**

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm start
   # or for development with auto-reload
   npm run dev
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm start
   ```

7. **Access the Application**

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Usage

### For Users

1. **Register/Login**: Create an account or login with existing credentials
2. **Browse Food**: View available food items on the home page
3. **Search**: Use the search bar to find specific food items
4. **Add to Cart**: Click "Add to Cart" on any food item
5. **View Cart**: Click on "Cart" in the navigation bar
6. **Place Order**: Enter delivery address and place order
7. **View Orders**: Check "My Orders" to see order history

### For Admin

1. **Login as Admin**: Use an admin account to access admin features
2. **Manage Food Items**: 
   - Add new food items
   - Edit existing items
   - Delete items
   - Toggle availability
3. **Manage Orders**:
   - View all orders
   - Update order status (pending, confirmed, preparing, out for delivery, delivered, cancelled)

### Creating an Admin User

To create an admin user, you can either:

1. Use MongoDB Compass or mongo shell to update a user:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { isAdmin: true } }
   )
   ```

2. Or modify the registration route temporarily to create admin users.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Food Items
- `GET /api/food` - Get all available food items
- `GET /api/food/:id` - Get single food item

### Orders
- `POST /api/orders` - Create new order (protected)
- `GET /api/orders/my-orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get single order (protected)

### Admin
- `GET /api/admin/foods` - Get all food items (admin only)
- `POST /api/admin/foods` - Create food item (admin only)
- `PUT /api/admin/foods/:id` - Update food item (admin only)
- `DELETE /api/admin/foods/:id` - Delete food item (admin only)
- `GET /api/admin/orders` - Get all orders (admin only)
- `PUT /api/admin/orders/:id` - Update order status (admin only)

## Available Scripts

### Backend
- `npm start` - Start the server
- `npm run dev` - Start server with nodemon (auto-reload)

### Frontend
- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner

## Design

The application features a modern, minimalist design with:
- Dark theme (black background)
- Yellow/Amber accent color (#ffc107)
- Responsive layout using Bootstrap
- Clean typography
- Smooth transitions and hover effects

## Future Enhancements

- Payment integration
- Real-time order tracking
- Email notifications
- User profile management
- Order reviews and ratings
- Multiple delivery addresses
- Wishlist functionality
- Food item categories and filters

## License

This project is open source and available under the MIT License.

## Contributing

Contributions, issues, and feature requests are welcome!

## Support

For support, email your-email@example.com or create an issue in the repository.

