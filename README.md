# Sustainable Products Order Portal

A modern, full-stack e-commerce portal for organic and sustainable products, built with the MERN stack.

## Features

- **Customer-Facing Features:**
  - Clean, responsive product catalog
  - Customer type identification (Sri City Residents vs University Clubs)
  - Smart shopping cart with quantity management
  - Dynamic checkout forms based on customer type
  - Business logic validation (pincode verification, bulk order minimums)
  - Order confirmation and thank you pages

- **Admin Features:**
  - Secure admin panel (accessible via secret key)
  - Complete product management (CRUD operations)
  - Order management and tracking
  - Email notifications for new orders
  - Dashboard with analytics

## Technology Stack

- **Frontend:** React.js with Tailwind CSS
- **Backend:** Node.js with Express.js
- **Database:** MongoDB with Mongoose
- **Email:** Nodemailer for order notifications
- **Icons:** Lucide React
- **Styling:** Tailwind CSS with custom design system

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Gmail account for email notifications

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sustainable-products-portal
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```env
MONGODB_URI=mongodb://localhost:27017/sustainable-products
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@ecoproducts.com
PORT=5000
```

4. Start the development servers:
```bash
# Start both frontend and backend
npm run dev:full

# Or start them separately:
# Backend only
npm run server

# Frontend only (in another terminal)
npm run dev
```

### Database Setup

The application will automatically create the necessary MongoDB collections. To add sample products, visit the admin panel and click "Add Sample Products".

## Usage

### Customer Flow

1. Visit the homepage
2. Select customer type (Sri City Resident or University Club)
3. Browse and add products to cart
4. Proceed to checkout and fill the appropriate form
5. Submit order and receive confirmation

### Admin Access

Access the admin panel at: `http://localhost:5173/admin?key=sustainable-admin-2025`

From the admin panel you can:
- Add, edit, and delete products
- View all orders and customer details
- Add sample products for testing
- Monitor sales analytics

### Business Rules

- **Sri City Residents:** Must provide valid Sri City pincode (517641-517646)
- **University Clubs:** Must order minimum 20 items for free delivery
- **Free Delivery:** Available for both customer types when conditions are met
- **Payment:** Cash on delivery for all orders

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products?key=SECRET` - Create product (admin)
- `PUT /api/products/:id?key=SECRET` - Update product (admin)
- `DELETE /api/products/:id?key=SECRET` - Delete product (admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders?key=SECRET` - Get all orders (admin)

### Utilities
- `POST /api/seed?key=SECRET` - Add sample products (admin)

## Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your preferred platform

### Backend (Render/Railway)
1. Deploy the `server` folder to your preferred platform
2. Set environment variables in your deployment platform
3. Update the API base URL in `src/lib/api.js`

## Environment Variables

### Required
- `MONGODB_URI` - MongoDB connection string
- `EMAIL_USER` - Gmail address for sending notifications
- `EMAIL_PASS` - Gmail app password
- `ADMIN_EMAIL` - Email to receive order notifications

### Optional
- `PORT` - Server port (default: 5000)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.