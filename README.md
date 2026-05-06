# Full Stack Application

A comprehensive full-stack application built with modern technologies including Bun.js backend, React.js web frontend, and Expo React Native mobile app.

## 🚀 Tech Stack

### Backend

- **Bun.js** with **Hono.js** - RESTful API server
- **PostgreSQL** - Database (specify your choice)
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Cors** - Cross-origin resource sharing

### Frontend Web

- **React.js** - React library with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Tanstack Table** - Table
- **Zustand** - State management

### Frontend Mobile

- **Expo React Native** - Cross-platform mobile development
- **TypeScript** - Type safety
- **React Navigation** - Navigation
- **Expo Vector Icons** - Icons
- **AsyncStorage** - Local storage

## 📁 Project Structure

```
project-root/
├── attendance-and-schedule/                 # Hono.js API server
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── utils/         # Utility functions
│   ├── uploads/           # File uploads
│   └── package.json
├── frontend-web/           # React.js web application
│   ├── src/
│   │   ├── pages/          # App Router pages
│   │   ├── components/   # Reusable components
│   │   ├── lib/          # Utilities and configurations
│   │   └── types/        # TypeScript type definitions
│   └── package.json
├── frontend-mobile/        # Expo React Native app
│   ├── app/
│   │   ├── (taps)/       # Tab screens
│   │   ├── components/   # Reusable components
│   │   ├── navigation/   # Navigation configuration
│   │   └── utils/        # Utility functions
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend directory:

```env
PORT = 3000
NODE_ENV = "development"
LOG_LEVEL = info
DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/postgres"
BETTER_AUTH_SECRET = SCRETE_KEY
BETTER_AUTH_URL = http://localhost:3000

WS_PORT = 3000
ADMIN_EMAIL = "[EMAIL_ADDRESS]"
ADMIN_PASSWORD = "[PASSWORD]"
ADMIN_NAME = "Super Admin"

```

Start the backend server:

```bash
npm run dev
```

### Frontend Web Setup

```bash
cd frontend-web
npm install
```

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

### Frontend Mobile Setup

```bash
cd frontend-mobile
npm install
```

Create `.env` file:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

Start the Expo development server:

```bash
npx expo start
```

## 🚦 Running the Application

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Web Frontend**: `cd frontend-web && npm run dev`
3. **Start Mobile App**: `cd frontend-mobile && npx expo start`

### Access Points

- **API Server**: http://localhost:5000
- **Web Application**: http://localhost:3000
- **Mobile App**: Use Expo Go app to scan QR code

## 📱 Features

### Core Features

- User authentication (register/login)
- JWT-based authorization
- CRUD operations
- File upload functionality
- Responsive design
- Cross-platform mobile support

### API Endpoints

#### Authentication Endpoints

```
POST   /api/auth/register    # User registration
POST   /api/auth/login       # User login
GET    /api/auth/profile     # Get user profile
PUT    /api/auth/profile     # Update user profile
```

**Detailed Explanation:**

**GET /api/auth/profile**

- **Purpose**: Retrieve current

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm run test
```

### Frontend Web Testing

```bash
cd frontend-web
npm run test
```

### Mobile Testing

```bash
cd frontend-mobile
npm run test
```

## 📦 Deployment

### Backend Deployment

- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repository
- **DigitalOcean**: Use App Platform
- **AWS**: Use Elastic Beanstalk or EC2

### Frontend Web Deployment

- **Vercel**: `vercel --prod`
- **Netlify**: Connect GitHub repository
- **Railway**: Connect GitHub repository

### Mobile App Deployment

- **Expo Application Services (EAS)**:

```bash
eas build --platform all
eas submit --platform all
```

## 🔧 Scripts

### Backend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
```

### Frontend Web Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Mobile App Scripts

```bash
npx expo start       # Start Expo development server
npx expo build       # Build app
eas build            # Build with EAS
eas submit           # Submit to app stores
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Backend Developer** - API development and database management
- **Frontend Web Developer** - Web application development
- **Mobile Developer** - Mobile application development
- **DevOps Engineer** - Deployment and infrastructure

---

**Happy Coding! 🎉**
