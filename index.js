const express = require('express');
const cors = require('cors');
const sessionMiddleware = require('./middlewares/sessionMiddleware');
const sequelize = require('./config/db');
require('./controllers/associations');

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(sessionMiddleware);

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const imageRoutes = require('./routes/imageRouters');
const categoryRouter = require('./routes/categoryRouter');
const detailRouter = require('./routes/detailRoutes');
const ingredientRouter = require('./routes/ingredientRouter');
const googleRouter = require('./auth/google');
const authRoutes = require('./routes/authRoutes');
const captchaRouter = require('./routes/captcha');
const cartRoutes = require('./routes/cartRoutes');
const addressRouter = require('./routes/addressRouter');
sequelize.sync({ alter: false })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/category', categoryRouter);
app.use('/api/details', detailRouter);
app.use('/api/ingredients', ingredientRouter);
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleRouter);
app.use('/api/captcha', captchaRouter);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRouter);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
