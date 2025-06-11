const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

// chọn chế độ môi trường từ biến môi trường NODE_ENV
const envMode = process.env.NODE_ENV
let envFileName = '.env'
if (envMode) envFileName += `.${envMode}`

// Nạp biến môi trường từ file .env tương ứng
dotenv.config({ path: path.resolve(process.cwd(), envFileName), override: true })

const envConfig = {
    serverHost: process.env.SERVER_HOST,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    jwtSecret: process.env.JWT_SECRET,
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    sessionSecret: process.env.SESSION_SECRET,
    email: process.env.EMAIL_NAME,
    emailPassword: process.env.EMAIL_APP_PASSWORD,
    captchaSecretKey: process.env.CAPTCHA_SECRET_KEY,
    frontendUrl: process.env.FRONTEND_URL,
    vnpayTmnCode: process.env.VNPAY_TMN_CODE,
    vnpayHashSecret: process.env.VNPAY_HASH_SECRET,
    vnpayUrl: process.env.VNP_URL,
    vnpayReturnUrl: process.env.VNP_RETURN_URL,
    frontendUrl: process.env.FRONTEND_URL,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

}

module.exports = envConfig;
