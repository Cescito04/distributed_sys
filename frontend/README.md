# Next.js E-commerce Frontend

A modern, responsive e-commerce frontend built with Next.js 15, TypeScript, and Tailwind CSS. Features JWT authentication, product management, and seamless integration with the Django backend API.

## 🚀 Features

- **🏠 Homepage** : Product listing with real-time API integration
- **🔐 Authentication** : User login and registration with JWT tokens
- **📦 Product Management** : Add, view, and manage products
- **📱 Responsive Design** : Mobile-first design with Tailwind CSS
- **⚡ TypeScript** : Strong typing for better maintainability
- **🐳 Docker Ready** : Containerized deployment support
- **🔄 Auto Token Refresh** : Seamless JWT token management
- **🎨 Modern UI/UX** : Clean, professional interface

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.3 | React framework with App Router |
| **React** | 19.1.0 | UI library |
| **TypeScript** | 5.x | Static type checking |
| **Tailwind CSS** | 3.4.0 | Utility-first CSS framework |
| **Axios** | 1.11.0 | HTTP client for API calls |
| **Docker** | Latest | Containerization |

## 🚀 Quick Start

### Option 1: Local Development

**Prerequisites:** Node.js 18+ and npm

1. **Clone and navigate to the project:**
   ```bash
   git clone <repository-url>
   cd distributed_sys/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   # Create .env.local file
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

### Option 2: Docker Development

**Prerequisites:** Docker and Docker Compose

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

2. **Or build and run manually:**
   ```bash
   # Build the image
   docker build -t frontend-ecommerce .
   
   # Run the container
   docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 frontend-ecommerce
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Optional: Enable debug mode
NEXT_PUBLIC_DEBUG=true
```

### API Configuration

The frontend connects to the Django backend via the URL configured in `NEXT_PUBLIC_API_URL`. The API client automatically handles:
- JWT token management
- Request/response interceptors
- Error handling and token refresh
- CORS configuration

## 📱 Available Pages

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Homepage with product listing | No |
| `/login` | User login page | No |
| `/register` | User registration page | No |
| `/add-product` | Add new product page | Yes (Admin) |

## 🔌 API Integration

### Backend Endpoints Used

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/api/v1/products/` | Fetch all products | No |
| POST | `/api/v1/products/create/` | Create new product | Yes (Admin) |
| POST | `/api/v1/auth/login/` | User authentication | No |
| POST | `/api/v1/users/create/` | User registration | No |
| GET | `/api/v1/auth/profile/` | Get user profile | Yes |
| POST | `/api/v1/auth/logout/` | User logout | Yes |

### Authentication Flow

The frontend implements a complete JWT authentication system:

1. **Login Process:**
   - User submits credentials via login form
   - Backend validates and returns JWT tokens
   - Tokens are stored in localStorage
   - User is redirected to homepage

2. **Token Management:**
   - Access tokens are automatically added to API requests
   - Refresh tokens are used to renew expired access tokens
   - Automatic logout on token expiration

3. **Security Features:**
   - Tokens stored securely in localStorage
   - Automatic token refresh before expiration
   - Protected routes with authentication checks
   - CSRF protection via Django backend

## 🎨 Styling & UI/UX

### Tailwind CSS Implementation
- **Utility-first approach** for rapid development
- **Mobile-first responsive design** with breakpoints
- **Consistent color scheme** and typography
- **Component-based architecture** for reusability
- **Dark mode support** (configurable)

### Design Features
- **Modern card-based layout** for products
- **Intuitive navigation** with clear CTAs
- **Loading states** and error handling
- **Form validation** with user feedback
- **Accessibility compliance** (WCAG 2.1)

## 🐳 Docker Configuration

### Multi-stage Dockerfile

| Stage | Purpose | Optimization |
|-------|---------|--------------|
| **deps** | Install dependencies | npm cache optimization |
| **builder** | Build application | Next.js standalone build |
| **runner** | Production image | Alpine Linux, non-root user |

### Docker Optimizations
- **Alpine Linux base** for minimal image size
- **npm dependency caching** for faster builds
- **Next.js standalone output** for production
- **Non-root user** for enhanced security
- **Multi-stage build** to reduce final image size

## 🚀 Deployment

### Production Build

1. **Create optimized build:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

### Docker Production

```bash
# Build production image
docker build -t frontend-ecommerce .

# Run production container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1 \
  frontend-ecommerce
```

### Environment-Specific Configuration

```bash
# Development
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Staging
NEXT_PUBLIC_API_URL=https://staging-api.yourdomain.com/api/v1

# Production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Homepage with product listing
│   │   ├── login/             # User authentication
│   │   │   └── page.tsx       # Login form
│   │   ├── register/          # User registration
│   │   │   └── page.tsx       # Registration form
│   │   ├── add-product/       # Product management
│   │   │   └── page.tsx       # Add product form
│   │   ├── globals.css        # Global styles and Tailwind
│   │   └── layout.tsx         # Root layout component
│   ├── services/              # API service layer
│   │   └── api.ts            # Axios client with interceptors
│   └── types/                 # TypeScript type definitions
│       └── index.ts          # Interface definitions
├── public/                    # Static assets
├── Dockerfile                # Multi-stage Docker configuration
├── docker-compose.yml        # Docker Compose orchestration
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── package.json             # Dependencies and scripts
└── README.md                # This documentation
```

## 🔧 Development

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Development** | `npm run dev` | Start development server with hot reload |
| **Build** | `npm run build` | Create optimized production build |
| **Start** | `npm run start` | Start production server |
| **Lint** | `npm run lint` | Run ESLint for code quality |

### Development Features
- **Hot Reload** : Instant updates during development
- **TypeScript** : Real-time type checking
- **ESLint** : Code quality and consistency
- **Tailwind CSS** : Utility-first styling with IntelliSense

## 🧪 Testing & Quality Assurance

### Manual Testing Checklist

1. **Start the backend:**
   ```bash
   cd ../backend
   docker-compose up --build
   ```

2. **Start the frontend:**
```bash
npm run dev
   ```

3. **Test core functionality:**
   - ✅ **Homepage** : Product listing loads correctly
   - ✅ **Navigation** : All links work properly
   - ✅ **Authentication** : Login/logout flow works
   - ✅ **Registration** : New user creation works
   - ✅ **Product Management** : Add product (admin only)
   - ✅ **Responsive Design** : Works on mobile/tablet/desktop
   - ✅ **Error Handling** : Graceful error messages
   - ✅ **Loading States** : Proper loading indicators

### Test Credentials
- **Admin Email:** admin@ecommerce.com
- **Admin Password:** admin123

## 🔧 API Testing Examples

### Frontend API Integration Testing

#### 1. Test Product Listing (Homepage)
```bash
# Test the products API endpoint directly
curl -X GET http://localhost:8000/api/v1/products/

# Expected: Returns list of products with success: true
```

#### 2. Test User Registration Flow
```bash
# Step 1: Register new user
curl -X POST http://localhost:8000/api/v1/users/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "frontendtest@example.com",
    "username": "frontendtest",
    "nom": "Frontend Test User",
    "password": "testpass123",
    "password_confirm": "testpass123"
  }'

# Step 2: Login with new user
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "frontendtest@example.com",
    "password": "testpass123"
  }'
```

#### 3. Test Authentication Flow
```bash
# Login as admin
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ecommerce.com",
    "password": "admin123"
  }'

# Save the access token from response, then test profile
curl -X GET http://localhost:8000/api/v1/auth/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 4. Test Product Creation (Admin)
```bash
# First login as admin to get token
ADMIN_TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@ecommerce.com", "password": "admin123"}' | \
  jq -r '.data.tokens.access')

# Create product using admin token
curl -X POST http://localhost:8000/api/v1/products/create/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "nom": "Frontend Test Product",
    "description": "Product created via API testing",
    "prix": 199.99,
    "quantite": 15
  }'
```

### Browser Testing Scenarios

#### 1. Homepage Testing
1. **Open** `http://localhost:3000`
2. **Verify** products are displayed in cards
3. **Check** loading states and error handling
4. **Test** responsive design on different screen sizes

#### 2. Authentication Testing
1. **Navigate** to `/login`
2. **Test** with invalid credentials (should show error)
3. **Test** with valid admin credentials:
   - Email: `admin@ecommerce.com`
   - Password: `admin123`
4. **Verify** redirect to homepage after successful login
5. **Check** that user info is stored in localStorage

#### 3. Registration Testing
1. **Navigate** to `/register`
2. **Fill** registration form with test data
3. **Test** password confirmation validation
4. **Submit** form and verify success message
5. **Test** login with newly created account

#### 4. Product Management Testing
1. **Login** as admin user
2. **Navigate** to `/add-product`
3. **Fill** product form with test data
4. **Submit** form and verify success
5. **Check** that product appears on homepage

### Frontend API Client Testing

#### Test API Service Functions
```javascript
// Test in browser console (http://localhost:3000)

// 1. Test product fetching
fetch('/api/v1/products/')
  .then(response => response.json())
  .then(data => console.log('Products:', data));

// 2. Test user registration
fetch('/api/v1/users/create/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'consoletest@example.com',
    username: 'consoletest',
    nom: 'Console Test User',
    password: 'testpass123',
    password_confirm: 'testpass123'
  })
})
.then(response => response.json())
.then(data => console.log('Registration:', data));

// 3. Test login
fetch('/api/v1/auth/login/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@ecommerce.com',
    password: 'admin123'
  })
})
.then(response => response.json())
.then(data => {
  console.log('Login:', data);
  // Store token for further tests
  localStorage.setItem('tokens', JSON.stringify(data.data.tokens));
});
```

### Error Handling Testing

#### 1. Network Error Testing
```bash
# Stop backend to test network errors
docker-compose -f ../backend/docker-compose.yml down

# Refresh frontend - should show connection error
# Restart backend to test recovery
docker-compose -f ../backend/docker-compose.yml up
```

#### 2. Authentication Error Testing
1. **Try** to access `/add-product` without login
2. **Verify** redirect to login page
3. **Test** with expired token
4. **Verify** automatic token refresh or logout

#### 3. Form Validation Testing
1. **Submit** empty forms
2. **Test** invalid email formats
3. **Test** password mismatch
4. **Test** negative prices/quantities
5. **Verify** proper error messages display

### Performance Testing

#### 1. Load Testing
```bash
# Test API performance with multiple requests
for i in {1..10}; do
  curl -s http://localhost:8000/api/v1/products/ > /dev/null &
done
wait
echo "10 concurrent requests completed"
```

#### 2. Frontend Performance
1. **Open** browser DevTools
2. **Check** Network tab for API call timing
3. **Monitor** memory usage during navigation
4. **Test** with large product lists

### Cross-Browser Testing

#### Supported Browsers
- ✅ **Chrome** 90+
- ✅ **Firefox** 88+
- ✅ **Safari** 14+
- ✅ **Edge** 90+

#### Testing Checklist
1. **Visual** consistency across browsers
2. **Functionality** works in all browsers
3. **Responsive** design on mobile browsers
4. **JavaScript** features work correctly
5. **LocalStorage** functionality

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed:**
   - Verify backend is running on port 8000
   - Check `NEXT_PUBLIC_API_URL` environment variable
   - Ensure CORS is properly configured

2. **Build Errors:**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run lint`

3. **Docker Issues:**
   - Ensure Docker is running
   - Check port availability (3000, 8000)
   - Rebuild images: `docker-compose up --build --force-recreate`

## 📚 Additional Resources

- **Next.js Documentation:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs
- **Docker:** https://docs.docker.com/

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of a distributed systems demonstration and is available for educational purposes.