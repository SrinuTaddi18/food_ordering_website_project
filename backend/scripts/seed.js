const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Food = require('../models/Food');

const MONGO_URI = process.env.MONGO_URI ||
  'mongodb+srv://taddisrinu2004:Navy%40190363@tutorials.doi7w.mongodb.net/fooddelivery?retryWrites=true&w=majority';


const foodItems = [
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella cheese, and fresh basil',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    category: 'Pizza',
    available: true
  },
  {
    name: 'Pepperoni Pizza',
    description: 'Delicious pizza topped with pepperoni and mozzarella cheese',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
    category: 'Pizza',
    available: true
  },
  {
    name: 'Chicken Burger',
    description: 'Juicy grilled chicken burger with lettuce, tomato, and special sauce',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e166a853?w=400',
    category: 'Burger',
    available: true
  },
  {
    name: 'Beef Burger',
    description: 'Classic beef burger with cheese, pickles, and onions',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    category: 'Burger',
    available: true
  },
  {
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    category: 'Salad',
    available: true
  },
  {
    name: 'Chicken Wings',
    description: 'Crispy fried chicken wings with your choice of sauce',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400',
    category: 'Appetizer',
    available: true
  },
  {
    name: 'French Fries',
    description: 'Golden crispy french fries served with ketchup',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
    category: 'Side',
    available: true
  },
  {
    name: 'Chocolate Cake',
    description: 'Rich and moist chocolate cake with chocolate frosting',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    category: 'Dessert',
    available: true
  },
  {
    name: 'Pasta Carbonara',
    description: 'Creamy pasta with bacon, eggs, and parmesan cheese',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
    category: 'Pasta',
    available: true
  },
  {
    name: 'Sushi Platter',
    description: 'Assorted fresh sushi rolls with soy sauce and wasabi',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    category: 'Sushi',
    available: true
  },
  {
    name: 'Hyderabadi Biryani',
    description: 'Aromatic basmati rice cooked with tender chicken, spices, and fried onions',
    price: 249,
    image: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=400',
    category: 'Biryani',
    available: true
  },
  {
    name: 'Veg Fried Noodles',
    description: 'Stir-fried noodles tossed with veggies and light soy seasoning',
    price: 159,
    image: 'https://images.unsplash.com/photo-1604908177225-055f34c0c6c3?w=400',
    category: 'Noodles',
    available: true
  },
  {
    name: 'Paneer Butter Masala',
    description: 'Rich and creamy tomato gravy with soft paneer cubes',
    price: 199,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    category: 'Indian',
    available: true
  },
  {
    name: 'Masala Dosa',
    description: 'Crispy rice crepe with spiced potato filling, served with chutney and sambar',
    price: 99,
    image: 'https://images.unsplash.com/photo-1542367597-2240163fb8f6?w=400',
    category: 'South Indian',
    available: true
  },
  {
    name: 'Veg Manchurian',
    description: 'Crispy veg balls in a tangy Indo-Chinese sauce',
    price: 179,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400',
    category: 'Indo-Chinese',
    available: true
  },
  {
    name: 'Tandoori Chicken',
    description: 'Yogurt and spice marinated chicken roasted in tandoor style',
    price: 299,
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899e?w=400',
    category: 'Grill',
    available: true
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Food.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@fooddelivery.com',
      password: 'admin123', // plain; schema pre-save will hash once
      isAdmin: true
    });
    await admin.save();
    console.log('Created admin user: admin@fooddelivery.com / admin123');

    // Create regular user
    const user = new User({
      name: 'Test User',
      email: 'user@fooddelivery.com',
      password: 'user123', // plain; schema pre-save will hash once
      isAdmin: false
    });
    await user.save();
    console.log('Created test user: user@fooddelivery.com / user123');

    // Create food items
    await Food.insertMany(foodItems);
    console.log(`Created ${foodItems.length} food items`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@fooddelivery.com / admin123');
    console.log('User: user@fooddelivery.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

