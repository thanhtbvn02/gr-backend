const express = require('express');
const cors = require('cors');
const sessionMiddleware = require('./middlewares/sessionMiddleware');

require('./config/db');
const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(sessionMiddleware);

const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const imageRoutes = require('./routes/imageRouters');
const categoryRouter =  require('./routes/categoryRouter');
const detailRouter = require('./routes/detailRoutes')
const ingredientRouter = require('./routes/ingredientRouter')
const googleRouter = require('./auth/google');
const authRoutes = require('./routes/authRoutes');
const captchaRouter = require('./routes/captcha');


// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/category', categoryRouter);
app.use('/api/detail', detailRouter)
app.use('/api/ingredient', ingredientRouter);
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleRouter);
app.use('/api/captcha', captchaRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
