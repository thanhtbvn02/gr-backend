# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Hầu hết các endpoints yêu cầu xác thực. Sử dụng token JWT trong header:
```
Authorization: Bearer <your_token>
```

## Endpoints

### Users

#### Register User
```http
POST /users/register
```
**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```

#### Login
```http
POST /users/login
```
**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

#### Logout
```http
POST /users/logout
```

#### Get All Users
```http
GET /users
```
**Query Parameters:**
- `page`: Số trang (mặc định: 1)
- `limit`: Số items mỗi trang (mặc định: 10)

#### Get User Count
```http
GET /users/count
```

#### Get User Count By Role
```http
GET /users/count/:role
```

#### Get User By ID
```http
GET /users/:id
```

#### Update User
```http
PUT /users/:id
```
**Request Body:**
```json
{
  "username": "string",
  "email": "string"
}
```

#### Change Password
```http
PUT /users/:id/change-password
```
**Request Body:**
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

#### Forgot Password
```http
POST /users/forgot-password
```
**Request Body:**
```json
{
  "email": "string"
}
```

#### Reset Password
```http
POST /users/reset-password
```
**Request Body:**
```json
{
  "token": "string",
  "newPassword": "string"
}
```

### Products

#### Search Products
```http
GET /products/search
```
**Query Parameters:**
- `q`: Từ khóa tìm kiếm
- `page`: Số trang
- `limit`: Số items mỗi trang

#### Get Paginated Products
```http
GET /products/paginate
```
**Query Parameters:**
- `page`: Số trang
- `limit`: Số items mỗi trang

#### Get Products By Category
```http
GET /products/category/:id
```
**Query Parameters:**
- `page`: Số trang
- `limit`: Số items mỗi trang

#### Get All Products
```http
GET /products
```

#### Get Product Count
```http
GET /products/count
```

#### Get Product Count By Category
```http
GET /products/count/:category_id
```

#### Get Product Count By Price Range
```http
GET /products/count/price
```

#### Get Product By ID
```http
GET /products/:id
```

#### Create Product
```http
POST /products
```
**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "category_id": "string",
  "image": "string"
}
```

#### Update Product
```http
PUT /products/:id
```
**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "category_id": "string",
  "image": "string"
}
```

#### Delete Product
```http
DELETE /products/:id
```

## Error Responses

Tất cả các endpoints có thể trả về các lỗi sau:

### 400 Bad Request
```json
{
  "error": "string",
  "message": "string"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Token không hợp lệ hoặc hết hạn"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Không có quyền truy cập"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Không tìm thấy resource"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Lỗi server"
}
```

## Rate Limiting

API có giới hạn số lượng request:
- 100 requests mỗi 15 phút cho mỗi IP
- 1000 requests mỗi ngày cho mỗi IP

## Versioning

API hiện tại đang sử dụng version 1. Version sẽ được thêm vào URL trong tương lai nếu cần thiết. 