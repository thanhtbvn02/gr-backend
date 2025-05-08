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
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    sessionSecret: process.env.SESSION_SECRET,
    email: process.env.EMAIL_NAME,
    emailPassword: process.env.EMAIL_APP_PASSWORD,
}

module.exports = envConfig;
