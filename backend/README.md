# Django E-commerce Backend API

A comprehensive Django REST API backend for a mini e-commerce application with PostgreSQL database, JWT authentication, and full CRUD operations for products and users.

## 🚀 Features

- **RESTful API** with Django REST Framework
- **JWT Authentication** with automatic token refresh
- **PostgreSQL Database** with optimized queries
- **User Management** with custom user model
- **Product Management** with full CRUD operations
- **Docker Support** with multi-stage builds
- **CORS Configuration** for frontend integration
- **Data Validation** with comprehensive error handling
- **Admin Interface** for easy management

## 📁 Project Structure

```
backend/
├── backend/                    # Main Django configuration
│   ├── __init__.py
│   ├── settings.py            # Application settings and configuration
│   ├── urls.py               # Main URL routing
│   ├── wsgi.py               # WSGI configuration for production
│   └── asgi.py               # ASGI configuration for async support
├── products/                  # Products application
│   ├── models.py             # Product model with validations
│   ├── views.py              # API views for product operations
│   ├── serializers.py        # DRF serializers for data validation
│   ├── urls.py               # Product-specific URL patterns
│   └── admin.py              # Django admin configuration
├── users/                     # Users application
│   ├── models.py             # Custom user model
│   ├── views.py              # User management API views
│   ├── serializers.py        # User data serializers
│   ├── auth_views.py         # JWT authentication views
│   ├── urls.py               # User and auth URL patterns
│   └── admin.py              # User admin configuration
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
├── Dockerfile               # Multi-stage Docker configuration
├── docker-compose.yml       # Docker Compose for development
├── create_superuser.py      # Script to create default admin
├── load_test_data.py        # Script to load sample data
├── API_DOCUMENTATION.md     # Complete API documentation
└── README.md                # This file
```

## 🗄️ Database Models

### User Model (Custom)
- `id`: Primary key (auto-generated)
- `email`: Email address (unique, used for login)
- `username`: Username (unique)
- `nom`: Display name
- `password`: Hashed password (Django's default hashing)
- `is_active`: Account status
- `is_staff`: Admin privileges
- `date_joined`: Registration date
- Inherits from Django's AbstractUser

### Product Model
- `id`: Primary key (auto-generated)
- `nom`: Product name (max 200 characters)
- `description`: Detailed product description (text field)
- `prix`: Price (DecimalField with validation > 0)
- `quantite`: Stock quantity (PositiveIntegerField)
- `date_creation`: Creation timestamp (auto-generated)
- `date_modification`: Last modification timestamp (auto-updated)

## 🔌 API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/login/` | User login with JWT tokens | No |
| POST | `/api/v1/auth/logout/` | User logout (blacklist token) | Yes |
| POST | `/api/v1/auth/refresh/` | Refresh access token | No |
| GET | `/api/v1/auth/profile/` | Get current user profile | Yes |

### User Management Endpoints
| Method | Endpoint | Description | Auth Required | Permissions |
|--------|----------|-------------|---------------|-------------|
| GET | `/api/v1/users/` | List all users | Yes | Admin only |
| POST | `/api/v1/users/create/` | Create new user | No | Public |
| GET | `/api/v1/users/<id>/` | Get user details | Yes | Owner/Admin |
| PUT | `/api/v1/users/<id>/` | Update user | Yes | Owner/Admin |
| DELETE | `/api/v1/users/<id>/` | Delete user | Yes | Admin only |

### Product Management Endpoints
| Method | Endpoint | Description | Auth Required | Permissions |
|--------|----------|-------------|---------------|-------------|
| GET | `/api/v1/products/` | List all products | No | Public |
| POST | `/api/v1/products/create/` | Create new product | Yes | Admin only |
| GET | `/api/v1/products/<id>/` | Get product details | No | Public |
| PUT | `/api/v1/products/<id>/` | Update product | Yes | Admin only |
| DELETE | `/api/v1/products/<id>/` | Delete product | Yes | Admin only |

### Example API Response
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "nom": "iPhone 15 Pro",
            "description": "Latest Apple smartphone with advanced features",
            "prix": "1199.99",
            "quantite": 50,
            "date_creation": "2024-01-01T10:00:00Z",
            "date_modification": "2024-01-01T10:00:00Z"
        }
    ],
    "count": 1
}
```

## 🚀 Quick Start

### Option 1: Docker (Recommended)

**Prerequisites:** Docker and Docker Compose installed

1. **Clone and navigate to the project:**
   ```bash
   git clone <repository-url>
   cd distributed_sys/backend
   ```

2. **Start the application with Docker Compose:**
   ```bash
   docker-compose up --build
   ```
   This will start:
   - PostgreSQL database on port 5433
   - Django application on port 8000

3. **Initialize the database (in a new terminal):**
   ```bash
   # Run database migrations
   docker-compose exec web python manage.py migrate
   
   # Create default admin user
   docker-compose exec web python create_superuser.py
   
   # Load sample data
   docker-compose exec web python load_test_data.py
   ```

4. **Access the application:**
   - **API Base URL:** http://localhost:8000/api/v1/
   - **Admin Panel:** http://localhost:8000/admin
   - **API Documentation:** See `API_DOCUMENTATION.md`

### Option 2: Local Development

**Prerequisites:** Python 3.12, PostgreSQL 15

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up PostgreSQL database:**
   ```sql
   CREATE DATABASE ecommerce_db;
   CREATE USER postgres WITH PASSWORD 'postgres';
   GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO postgres;
   ```

3. **Configure environment variables:**
   ```bash
   export DEBUG=True
   export SECRET_KEY="your-secret-key-here"
   export DATABASE_URL="postgres://postgres:postgres@localhost:5432/ecommerce_db"
   ```

4. **Run database migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create admin user and load data:**
   ```bash
   python create_superuser.py
   python load_test_data.py
   ```

6. **Start the development server:**
   ```bash
   python manage.py runserver
   ```

## ⚙️ Configuration

### Database Configuration
Default PostgreSQL settings in `settings.py`:
- **Host:** localhost (or `db` for Docker)
- **Port:** 5432 (or 5433 for Docker)
- **Database:** ecommerce_db
- **User:** postgres
- **Password:** postgres

### Environment Variables
```bash
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgres://postgres:postgres@localhost:5432/ecommerce_db
```

### Default Admin User
- **Email:** admin@ecommerce.com
- **Username:** admin
- **Password:** admin123

## 🛠️ Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.12 | Programming language |
| **Django** | 4.2.7 | Web framework |
| **Django REST Framework** | 3.14.0 | API framework |
| **djangorestframework-simplejwt** | 5.3.0 | JWT authentication |
| **PostgreSQL** | 15 | Database |
| **psycopg2-binary** | 2.9.9 | PostgreSQL adapter |
| **django-cors-headers** | 4.3.1 | CORS handling |
| **Docker** | Latest | Containerization |

## 🔒 Security Features

- **Password Hashing:** Django's built-in PBKDF2 with SHA256
- **JWT Authentication:** Secure token-based authentication
- **CORS Protection:** Configurable cross-origin resource sharing
- **Data Validation:** Comprehensive input validation and sanitization
- **SQL Injection Protection:** Django ORM prevents SQL injection
- **CSRF Protection:** Built-in CSRF token validation
- **Permission System:** Role-based access control (RBAC)

## 📚 API Testing Examples

### 🔐 Authentication Endpoints

#### 1. User Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ecommerce.com",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@ecommerce.com",
      "username": "admin",
      "nom": "Administrator",
      "is_active": true,
      "date_joined": "2024-01-01T10:00:00Z"
    },
    "tokens": {
      "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    }
  }
}
```

#### 2. User Registration
```bash
curl -X POST http://localhost:8000/api/v1/users/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "username": "newuser",
    "nom": "New User",
    "password": "password123",
    "password_confirm": "password123"
  }'
```

#### 3. Get User Profile
```bash
curl -X GET http://localhost:8000/api/v1/auth/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 4. Refresh Token
```bash
curl -X POST http://localhost:8000/api/v1/auth/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "YOUR_REFRESH_TOKEN"
  }'
```

#### 5. User Logout
```bash
curl -X POST http://localhost:8000/api/v1/auth/logout/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "refresh": "YOUR_REFRESH_TOKEN"
  }'
```

### 👥 User Management Endpoints

#### 1. List All Users (Admin Only)
```bash
curl -X GET http://localhost:8000/api/v1/users/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 2. Get User Details
```bash
curl -X GET http://localhost:8000/api/v1/users/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 3. Update User
```bash
curl -X PUT http://localhost:8000/api/v1/users/1/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "nom": "Updated Name",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

#### 4. Delete User (Admin Only)
```bash
curl -X DELETE http://localhost:8000/api/v1/users/2/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 📦 Product Management Endpoints

#### 1. List All Products (Public)
```bash
curl -X GET http://localhost:8000/api/v1/products/
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nom": "iPhone 15 Pro",
      "description": "Latest Apple smartphone with advanced features",
      "prix": "1199.99",
      "quantite": 50,
      "date_creation": "2024-01-01T10:00:00Z",
      "date_modification": "2024-01-01T10:00:00Z"
    }
  ],
  "count": 1
}
```

#### 2. Get Product Details
```bash
curl -X GET http://localhost:8000/api/v1/products/1/
```

#### 3. Create New Product (Admin Only)
```bash
curl -X POST http://localhost:8000/api/v1/products/create/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "nom": "MacBook Pro M3",
    "description": "Powerful laptop with M3 chip for professionals",
    "prix": 2499.99,
    "quantite": 25
  }'
```

#### 4. Update Product (Admin Only)
```bash
curl -X PUT http://localhost:8000/api/v1/products/1/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "nom": "iPhone 15 Pro Max",
    "description": "Updated description",
    "prix": 1299.99,
    "quantite": 30
  }'
```

#### 5. Partial Update Product
```bash
curl -X PATCH http://localhost:8000/api/v1/products/1/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "prix": 1099.99,
    "quantite": 40
  }'
```

#### 6. Delete Product (Admin Only)
```bash
curl -X DELETE http://localhost:8000/api/v1/products/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 🧪 Complete Testing Workflow

#### Step 1: Register a New User
```bash
curl -X POST http://localhost:8000/api/v1/users/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "username": "testuser",
    "nom": "Test User",
    "password": "testpass123",
    "password_confirm": "testpass123"
  }'
```

#### Step 2: Login with New User
```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "testpass123"
  }'
```

#### Step 3: Get User Profile
```bash
# Use the access token from login response
curl -X GET http://localhost:8000/api/v1/auth/profile/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

#### Step 4: List Products
```bash
curl -X GET http://localhost:8000/api/v1/products/
```

#### Step 5: Create Product (Admin Required)
```bash
# First login as admin
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ecommerce.com",
    "password": "admin123"
  }'

# Then create product with admin token
curl -X POST http://localhost:8000/api/v1/products/create/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -d '{
    "nom": "Test Product",
    "description": "A test product for API testing",
    "prix": 99.99,
    "quantite": 10
  }'
```

### 🔧 Error Handling Examples

#### Invalid Login Credentials
```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@email.com",
    "password": "wrongpassword"
  }'
```

**Response:**
```json
{
  "success": false,
  "message": "Email ou mot de passe incorrect"
}
```

#### Unauthorized Access
```bash
curl -X GET http://localhost:8000/api/v1/users/ \
  -H "Authorization: Bearer invalid_token"
```

**Response:**
```json
{
  "detail": "Given token not valid for any token type"
}
```

#### Validation Error
```bash
curl -X POST http://localhost:8000/api/v1/products/create/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "nom": "",
    "description": "Test",
    "prix": -10,
    "quantite": -5
  }'
```

**Response:**
```json
{
  "success": false,
  "errors": {
    "nom": ["This field may not be blank."],
    "prix": ["Le prix doit être supérieur à 0."],
    "quantite": ["La quantité ne peut pas être négative."]
  }
}
```

### 📱 Using Postman

1. **Import Collection:** Use the API collection from `API_DOCUMENTATION.md`
2. **Set Environment Variables:**
   - `base_url`: `http://localhost:8000/api/v1`
   - `access_token`: `{{login_response.tokens.access}}`
   - `refresh_token`: `{{login_response.tokens.refresh}}`
3. **Run Tests:** Execute the collection in sequence

## 🐛 Troubleshooting

### Common Issues

1. **Port 5432 already in use:**
   - Use Docker Compose (maps to port 5433)
   - Or stop local PostgreSQL service

2. **Database connection refused:**
   - Ensure PostgreSQL is running
   - Check database credentials in settings.py

3. **CORS errors:**
   - Verify CORS_ALLOWED_ORIGINS in settings.py
   - Check frontend URL configuration

4. **JWT token expired:**
   - Use refresh token endpoint
   - Check token expiration settings

## 📖 Additional Documentation

- **API Documentation:** See `API_DOCUMENTATION.md` for detailed endpoint documentation
- **Django Admin:** Access at `/admin/` for database management
- **Database Schema:** Check models.py for detailed field definitions
