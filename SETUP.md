# Quick Setup Guide

## Step-by-Step Setup Instructions

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configure Environment

**Backend (.env file in backend/):**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fooddelivery
JWT_SECRET=your-secret-key-change-in-production
```

**Frontend (.env file in frontend/ - optional):**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

- **Local MongoDB**: Make sure MongoDB service is running
- **MongoDB Atlas**: Update `MONGO_URI` in backend/.env with your connection string

### 4. Seed Database (Optional but Recommended)

```bash
cd backend
npm run seed
```

This creates:
- Admin: `admin@fooddelivery.com` / `admin123`
- User: `user@fooddelivery.com` / `user123`
- 10 sample food items

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# or for development
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 6. Access the App

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check MongoDB service
- Verify connection string in `.env` file
- For MongoDB Atlas, whitelist your IP address

### Port Already in Use
- Change `PORT` in backend/.env
- Update `REACT_APP_API_URL` in frontend/.env accordingly

### CORS Issues
- Ensure backend is running before frontend
- Check that API_URL in frontend matches backend port

### Module Not Found Errors
- Run `npm install` in both backend and frontend directories
- Delete `node_modules` and `package-lock.json`, then reinstall

## Testing the Application

1. **Login as Admin:**
   - Email: `admin@fooddelivery.com`
   - Password: `admin123`
   - Access admin panel to manage food items and orders

2. **Login as User:**
   - Email: `user@fooddelivery.com`
   - Password: `user123`
   - Browse food, add to cart, and place orders

3. **Register New User:**
   - Click Register tab on login page
   - Create a new account

## Next Steps

- Customize food items in admin panel
- Add more food categories
- Configure payment integration (if needed)
- Deploy to production

