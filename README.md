# QUICK_LEAVE

QuickE Leave is a modern leave management system built with React + Vite for the frontend and Django + DRF (Django Rest Framework) for the backend API. The system uses PostgreSQL as its database.

## 🚀 Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Lucide React Icons

### Backend
- Django 4.2+
- Django Rest Framework
- PostgreSQL
- Python 3.8+

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16+)
- Python 3.8+
- PostgreSQL
- Git

## ⚙️ Installation

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/Marvafathima/QUICK_LEAVE.git
cd quicke-leave
```

2. Create and activate virtual environment
```bash
python -m virtualenv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

3. Install Python dependencies
```bash
pip install -r requirements.txt
```

4. Create `.env` file in the backend directory
```bash
# .env
DEBUG=True
SECRET_KEY=your-secret-key-here
DB_NAME=quicke_leave
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
ALLOWED_HOSTS=localhost,127.0.0.1
```

5. Create PostgreSQL database
```sql
CREATE DATABASE quicke_leave;
```

6. Run migrations
```bash
python manage.py migrate
```

7. Create superuser (Optional)
```bash
python manage.py createsuperuser
```

### Frontend Setup

1. Navigate to frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file in the frontend directory
```bash
# .env
VITE_API_URL=http://localhost:8000/api
```

## 🚀 Running the Application

### Start Backend Server
```bash
# From the backend directory
python manage.py runserver
```
The API will be available at `http://localhost:8000/api/`

### Start Frontend Development Server
```bash
# From the frontend directory
npm run dev
```
The application will be available at `http://localhost:5173`

## 📦 Building for Production

### Frontend Build
```bash
# From the frontend directory
npm run build
```
The build files will be available in the `dist` directory

### Backend Production Settings
1. Update `.env` file
```bash
DEBUG=False
ALLOWED_HOSTS=your-domain.com
```

2. Configure your web server (Nginx/Apache) to serve the application

## 🔒 API Authentication

The API uses token-based authentication. To get an access token:

1. Make a POST request to `/api/auth/login/` with your credentials
2. Include the token in subsequent requests:
```
Authorization: Bearer your-token-here
```

## 📁 Project Structure backend
```

├── leaveapp
│   ├── admin.py
│   ├── apps.py
│   ├── __init__.py
│   ├── models.py
│   ├── __pycache__
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
├── manage.py
├── media
│   └── profile_pics
│     
├── quickleave_server
│   ├── asgi.py
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── requirements.txt
└── userauthentication
    ├── admin.py
    ├── apps.py
    ├── __init__.py
    ├── migrations
    ├── models.py
    ├── __pycache__
    ├── serializers.py
    ├── tests.py
    ├── urls.py
    └── views.py

## 🔍 Common Issues & Troubleshooting

1. Database Connection Issues
- Verify PostgreSQL is running
- Check credentials in `.env` file
- Ensure database exists

2. Frontend API Connection
- Check if backend server is running
- Verify VITE_API_URL in frontend `.env`
- Check for CORS settings in Django

3. Virtual Environment Issues
- Ensure virtualenv is activated
- Verify Python version matches requirements

## 🔄 Available Scripts

### Backend
- `python manage.py runserver` - Run development server
- `python manage.py test` - Run tests
- `python manage.py makemigrations` - Create database migrations
- `python manage.py migrate` - Apply migrations

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support, email support@quickeleave.com or open an issue in the repository.