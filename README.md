# Job Application Backend API

A Node.js/Express backend API for managing job applications, user authentication, and file uploads.

## Features

- 🔐 User authentication with JWT
- 👤 Admin and user roles
- 📄 Job posting management
- 📝 Application submission with resume upload
- 🔒 Secure file upload with validation
- 🌐 CORS configuration for cross-origin requests

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration (see Environment Variables section below)

4. **Start the server**
   
   **Development mode:**
   ```bash
   npm run dev
   ```
   
   **Production mode:**
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000` (or your configured PORT)

## Environment Variables

All sensitive data is stored in environment variables. Copy `.env.example` to `.env` and configure the following:

### Server Configuration
```env
PORT=3000                    # Server port
NODE_ENV=development         # Environment (development/production)
```

### Database Configuration
```env
MONGODB_URI=mongodb://localhost:27017/Jobs_database
```

### JWT Configuration
```env
JWT_SECRET=your_secret_key   # Change this in production!
JWT_EXPIRE=1h                # Token expiration time
```

### CORS Configuration
```env
# Comma-separated list of allowed origins
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

### Admin Credentials
```env
ADMIN_EMAIL=admin@example.com      # Change in production!
ADMIN_PASSWORD=secure_password     # Change in production!
```

### Security Configuration
```env
BCRYPT_SALT_ROUNDS=10       # Password hashing strength
```

### File Upload Configuration
```env
MAX_FILE_SIZE_MB=5          # Maximum file upload size in MB
UPLOAD_DIR=uploads/resumes  # Upload directory path
```

### Cookie Configuration
```env
COOKIE_SECURE=false         # Set to true in production (requires HTTPS)
COOKIE_SAME_SITE=strict     # Cookie SameSite attribute
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login (user or admin)
- `POST /auth/logout` - Logout

### Jobs (Admin only)
- `POST /jobs` - Create a new job posting
- `GET /jobs` - Get all jobs
- `GET /jobs/:id` - Get job by ID
- `PUT /jobs/:id` - Update job
- `DELETE /jobs/:id` - Delete job

### Applications
- `POST /applications` - Submit job application (with resume)
- `GET /applications` - Get all applications (Admin only)
- `GET /applications/user` - Get user's applications

## File Upload

- Supported formats: PDF, DOC, DOCX
- Maximum file size: Configurable via `MAX_FILE_SIZE_MB` (default: 5MB)
- Files are stored in: `uploads/resumes/`

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control (Admin/User)
- File type validation
- File size limits
- CORS protection
- Secure cookie configuration

## Production Deployment

⚠️ **Before deploying to production:**

1. **Change all default credentials:**
   - `JWT_SECRET` - Generate a strong random secret
   - `ADMIN_EMAIL` - Set your admin email
   - `ADMIN_PASSWORD` - Use a strong password

2. **Update environment-specific settings:**
   - Set `NODE_ENV=production`
   - Set `COOKIE_SECURE=true` (requires HTTPS)
   - Update `CORS_ORIGIN` to your production domain
   - Update `MONGODB_URI` to your production database

3. **See `DEPLOYMENT.md` for complete deployment guide**

## Project Structure

```
backend/
├── app.js                      # Main application file
├── package.json               # Dependencies and scripts
├── .env                       # Environment variables (not in git)
├── .env.example              # Environment template
├── config/
│   └── database.js           # Database connection
├── Controller/
│   ├── auth.controller.js    # Authentication logic
│   ├── jobs.controller.js    # Job management
│   └── application.controller.js # Application management
├── middleware/
│   ├── auth.middleware.js    # JWT verification
│   └── upload.middleware.js  # File upload handling
├── models/
│   ├── usertable.js         # User model
│   ├── job.js               # Job model
│   └── application.js       # Application model
├── Router/
│   ├── auth.routes.js       # Auth routes
│   ├── jobs.routes.js       # Job routes
│   └── application.routes.js # Application routes
└── uploads/
    └── resumes/             # Uploaded resume files
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Run in production mode
npm start
```

## License

MIT

## Support

For issues or questions, please open an issue on the repository.
