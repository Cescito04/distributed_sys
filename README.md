# Distributed E-commerce System

A complete full-stack e-commerce monorepo built with Django REST Framework (backend), Next.js (frontend), and PostgreSQL database. Includes Docker containerization and production-ready Kubernetes manifests for cloud deployment.

## 🚀 Project Overview

This project is a complete e-commerce platform featuring:
- **Backend API**: Django REST Framework with JWT authentication
- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Database**: PostgreSQL
- **Containerization**: Docker and Docker Compose
- **Testing**: Comprehensive automated testing suite

## 📁 Project Structure

```
distributed_sys/
├── backend/                    # Django REST API
│   ├── backend/               # Django project settings
│   ├── products/              # Products app
│   ├── users/                 # Users & authentication app
│   ├── Dockerfile            # Backend Docker configuration
│   ├── docker-compose.yml    # Backend services orchestration
│   ├── requirements.txt      # Python dependencies
│   ├── README.md             # Backend documentation
│   └── API_DOCUMENTATION.md  # Complete API reference
│
├── frontend/                  # Next.js application
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   ├── services/         # API service layer
│   │   └── types/            # TypeScript definitions
│   ├── Dockerfile            # Frontend Docker configuration
│   ├── docker-compose.yml    # Frontend service orchestration
│   ├── package.json          # Node dependencies
│   └── README.md             # Frontend documentation
│
├── test_api.sh               # Automated API testing script
└── README.md                 # This file
```

## 🎯 Key Features

### Backend Features
- ✅ **RESTful API** with Django REST Framework
- ✅ **JWT Authentication** with automatic token refresh
- ✅ **User Management** with custom user model
- ✅ **Product Management** with full CRUD operations
- ✅ **Role-Based Access Control** (RBAC)
- ✅ **Data Validation** with comprehensive error handling
- ✅ **CORS Configuration** for frontend integration
- ✅ **PostgreSQL Database** with migrations
- ✅ **Docker Support** with multi-container setup

### Frontend Features
- ✅ **Next.js 15** with App Router
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS** for modern styling
- ✅ **JWT Authentication** with automatic token management
- ✅ **Responsive Design** (mobile, tablet, desktop)
- ✅ **Form Validation** with user feedback
- ✅ **Error Handling** with graceful fallbacks
- ✅ **Loading States** for better UX
- ✅ **Docker Support** with optimized builds

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Kubernetes cluster (for K8s deployment)
- Node.js 18+ (for local development)
- Python 3.12+ (for local development)

### Option 1: Docker Compose - Complete Stack (Recommended)

Deploy everything with a single command:

```bash
# Start all services (Backend + Frontend + PostgreSQL)
docker-compose up -d --build

# Wait for services to start, then initialize database
docker-compose exec backend python manage.py migrate
docker-compose exec backend python create_superuser.py
docker-compose exec backend python load_test_data.py

# Run automated tests
./test_api.sh
```

**Access Applications:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/v1
- **Admin Panel**: http://localhost:8000/admin

### Option 2: Kubernetes Deployment

Deploy on Kubernetes (Minikube, K3s, or cloud):

```bash
cd k8s

# Quick deployment
make deploy-step

# Check status
make status

# Access locally
make port-forward
```

**See [k8s/README.md](k8s/README.md) for complete Kubernetes guide**

### Option 3: Individual Services (Development)

#### Backend Only
```bash
cd backend
docker-compose up -d --build
docker-compose exec web python manage.py migrate
docker-compose exec web python create_superuser.py
```

#### Frontend Only
```bash
cd frontend
docker-compose up -d --build
```

### Option 2: Local Development

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python create_superuser.py
python load_test_data.py
python manage.py runserver
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testing

### Automated Testing
Run the comprehensive test suite:
```bash
./test_api.sh
```

This script tests:
- ✅ Products endpoints (GET, POST, PUT, DELETE)
- ✅ User management (registration, login, profile)
- ✅ Authentication flow (JWT tokens)
- ✅ Error handling
- ✅ Performance metrics

### Manual Testing Examples

#### Test Authentication
```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ecommerce.com","password":"admin123"}'
```

#### Get Products
```bash
curl http://localhost:8000/api/v1/products/
```

#### Create Product (Admin Required)
```bash
curl -X POST http://localhost:8000/api/v1/products/create/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "nom":"Test Product",
    "description":"Product description",
    "prix":99.99,
    "quantite":10
  }'
```

## 🔐 Default Credentials

### Admin User
- **Email**: admin@ecommerce.com
- **Password**: admin123

## 📚 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/login/` | User login | No |
| POST | `/api/v1/auth/logout/` | User logout | Yes |
| POST | `/api/v1/auth/refresh/` | Refresh token | No |
| GET | `/api/v1/auth/profile/` | Get user profile | Yes |

### User Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/users/` | List all users | Yes (Admin) |
| POST | `/api/v1/users/create/` | Create user | No |
| GET | `/api/v1/users/<id>/` | Get user details | Yes |
| PUT | `/api/v1/users/<id>/` | Update user | Yes |
| DELETE | `/api/v1/users/<id>/` | Delete user | Yes (Admin) |

### Product Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/products/` | List all products | No |
| POST | `/api/v1/products/create/` | Create product | Yes (Admin) |
| GET | `/api/v1/products/<id>/` | Get product details | No |
| PUT | `/api/v1/products/<id>/` | Update product | Yes (Admin) |
| DELETE | `/api/v1/products/<id>/` | Delete product | Yes (Admin) |

For complete API documentation, see [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)

## 🛠️ Technology Stack

### Backend
- **Python** 3.12
- **Django** 4.2.7
- **Django REST Framework** 3.14.0
- **djangorestframework-simplejwt** 5.3.0
- **PostgreSQL** 15
- **Docker** & Docker Compose

### Frontend
- **Next.js** 15.5.3
- **React** 19.1.0
- **TypeScript** 5.x
- **Tailwind CSS** 3.4.0
- **Axios** 1.11.0
- **Docker** & Docker Compose

## 📖 Additional Documentation

- [Backend README](backend/README.md) - Complete backend documentation
- [Frontend README](frontend/README.md) - Complete frontend documentation
- [API Documentation](backend/API_DOCUMENTATION.md) - Detailed API reference

## 🐛 Troubleshooting

### Port Already in Use
If you get a "port already allocated" error:
```bash
# For port 8000 (backend)
lsof -ti:8000 | xargs kill -9

# For port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Docker Issues
```bash
# Clean up and restart
docker-compose down
docker-compose up --build --force-recreate
```

### Database Connection Issues
```bash
# Reset database
docker-compose down -v
docker-compose up -d
docker-compose exec web python manage.py migrate
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created for educational purposes as part of a distributed systems demonstration.

## 🎓 Learning Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## ✨ Features Roadmap

- [ ] User cart management
- [ ] Order processing
- [ ] Payment integration
- [ ] Product search and filtering
- [ ] Product reviews and ratings
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Analytics and reporting

---

**Built with ❤️ using Django, Next.js, and Docker**

