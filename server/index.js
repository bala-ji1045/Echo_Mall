const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sustainable-products', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image_url: { type: String, required: true },
}, { timestamps: true });

// Order Schema
const orderSchema = new mongoose.Schema({
  customer_type: { 
    type: String, 
    required: true, 
    enum: ['sri_city', 'university_club'] 
  },
  customer_data: { type: Object, required: true },
  items: [{ 
    product_id: String,
    product_name: String,
    price: Number,
    quantity: Number
  }],
  total_amount: { type: Number, required: true },
  total_quantity: { type: Number, required: true },
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'processing', 'completed']
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// Email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Sri City valid pincodes
const SRI_CITY_PINCODES = ['517646', '517645', '517644', '517643', '517642', '517641'];
const CLUB_MINIMUM_QUANTITY = 20;
const ADMIN_SECRET_KEY = 'sustainable-admin-2025';

// Routes

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new product (Admin only)
app.post('/api/products', async (req, res) => {
  try {
    const { key } = req.query;
    if (key !== ADMIN_SECRET_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update product (Admin only)
app.put('/api/products/:id', async (req, res) => {
  try {
    const { key } = req.query;
    if (key !== ADMIN_SECRET_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete product (Admin only)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { key } = req.query;
    if (key !== ADMIN_SECRET_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create new order
app.post('/api/orders', async (req, res) => {
  try {
    const { customer_type, customer_data, items, total_amount, total_quantity } = req.body;

    // Validate Sri City pincode
    if (customer_type === 'sri_city' && !SRI_CITY_PINCODES.includes(customer_data.pincode)) {
      return res.status(400).json({ error: 'Invalid Sri City pincode' });
    }

    // Validate club minimum quantity
    if (customer_type === 'university_club' && total_quantity < CLUB_MINIMUM_QUANTITY) {
      return res.status(400).json({ 
        error: `Club orders require minimum ${CLUB_MINIMUM_QUANTITY} items` 
      });
    }

    const order = new Order({
      customer_type,
      customer_data,
      items,
      total_amount,
      total_quantity
    });

    await order.save();

    // Send email notification to admin
    const emailContent = `
      New Order Received!
      
      Order ID: ${order._id}
      Customer Type: ${customer_type === 'sri_city' ? 'Sri City Resident' : 'University Club'}
      Total Amount: ₹${total_amount}
      Total Items: ${total_quantity}
      
      Customer Details:
      ${JSON.stringify(customer_data, null, 2)}
      
      Order Items:
      ${items.map(item => `- ${item.product_name} x${item.quantity} = ₹${item.price * item.quantity}`).join('\n')}
      
      Order Date: ${new Date().toLocaleString()}
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Order - EcoProducts',
      text: emailContent
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all orders (Admin only)
app.get('/api/orders', async (req, res) => {
  try {
    const { key } = req.query;
    if (key !== ADMIN_SECRET_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seed initial products
app.post('/api/seed', async (req, res) => {
  try {
    const { key } = req.query;
    if (key !== ADMIN_SECRET_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const sampleProducts = [
      {
        name: 'Organic Quinoa',
        description: 'Premium quality organic quinoa grown sustainably. Rich in protein and essential amino acids. Perfect for healthy meals and salads.',
        price: 299.00,
        image_url: 'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=500'
      },
      {
        name: 'Cold Pressed Coconut Oil',
        description: 'Pure virgin coconut oil extracted through traditional cold-pressing methods. Ideal for cooking and skincare applications.',
        price: 450.00,
        image_url: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=500'
      },
      {
        name: 'Organic Honey',
        description: 'Raw, unprocessed honey sourced from sustainable beekeeping practices. Natural sweetener with amazing health benefits.',
        price: 325.00,
        image_url: 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=500'
      },
      {
        name: 'Mixed Organic Nuts',
        description: 'Premium assortment of organic almonds, walnuts, and cashews. Perfect healthy snack packed with nutrients and healthy fats.',
        price: 550.00,
        image_url: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=500'
      },
      {
        name: 'Herbal Green Tea',
        description: 'Organic green tea blend with natural herbs and spices. Antioxidant-rich beverage for daily wellness and energy.',
        price: 180.00,
        image_url: 'https://images.pexels.com/photos/1367204/pexels-photo-1367204.jpeg?auto=compress&cs=tinysrgb&w=500'
      },
      {
        name: 'Organic Brown Rice',
        description: 'Sustainably grown brown rice with high fiber content. Nutritious whole grain perfect for healthy daily meals.',
        price: 225.00,
        image_url: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=500'
      }
    ];

    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    
    res.json({ message: 'Sample products added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});