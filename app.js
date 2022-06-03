const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Controllers
const { globalErrorHandler } = require('./controllers/errorsController');

// Routers
const { usersRouter } = require('./routes/usersRoutes');
const { productsRoutes } = require('./routes/productsRoutes');
const { cartsRoutes } = require('./routes/cartsRoutes');
const { categoryRoutes } = require('./routes/categoriesRoutes');

// Init express app
const app = express();

// Enable CORS
app.use(cors());

// Enable incoming JSON data
app.use(express.json());

// Limit IP requests
const limiter = rateLimit({
  max: 10000,
  windowMs: 1 * 60 * 60 * 1000, // 1 hr
  message: 'Too many requests from this IP',
});

app.use(limiter);

// Endpoints
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/cart', cartsRoutes);
app.use('/api/v1/category', categoryRoutes);

// Global error handler
app.use('*', globalErrorHandler);

module.exports = { app };
