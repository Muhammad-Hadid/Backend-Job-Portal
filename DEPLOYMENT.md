# Production Deployment Guide

## Environment Configuration

This project uses environment variables for all sensitive and environment-specific data. Before deploying to production, you **MUST** configure these variables properly.

### Required Environment Variables

#### Server Configuration
- `PORT` - The port number on which the server will run (default: 3000)
- `NODE_ENV` - Set to `production` for production deployments

#### Database Configuration
- `MONGODB_URI` - Your MongoDB connection string
  - Example: `mongodb://localhost:27017/Jobs_database`
  - For cloud (MongoDB Atlas): `mongodb+srv://username:password@cluster.mongodb.net/database_name`

#### JWT Configuration
- `JWT_SECRET` - **CRITICAL**: Change this to a strong, random secret key
  - Generate using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `JWT_EXPIRE` - Token expiration time (e.g., `1h`, `24h`, `7d`)

#### CORS Configuration
- `CORS_ORIGIN` - Comma-separated list of allowed origins
  - Example: `https://yourdomain.com,https://www.yourdomain.com`
  - For production, **DO NOT** use `*` or wildcard origins

#### Admin Credentials
- `ADMIN_EMAIL` - **CRITICAL**: Change the admin email address
- `ADMIN_PASSWORD` - **CRITICAL**: Change the admin password to a strong password

#### Security Configuration
- `BCRYPT_SALT_ROUNDS` - Number of salt rounds for password hashing (default: 10)
  - Higher values = more secure but slower (recommended: 10-12)

#### File Upload Configuration
- `MAX_FILE_SIZE_MB` - Maximum file upload size in megabytes (default: 5)
- `UPLOAD_DIR` - Directory for uploaded files (default: `uploads/resumes`)

#### Cookie Configuration
- `COOKIE_SECURE` - Set to `true` in production (requires HTTPS)
- `COOKIE_SAME_SITE` - Cookie SameSite attribute (`strict`, `lax`, or `none`)

---

## Deployment Steps

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit the .env file with your production values
# Use a text editor to modify .env
```

### 4. **CRITICAL**: Change These Values in Production

⚠️ **Security Warning**: The following values MUST be changed before deploying to production:

1. **JWT_SECRET**: Generate a strong random secret
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **ADMIN_EMAIL**: Change from default
3. **ADMIN_PASSWORD**: Use a strong password
4. **MONGODB_URI**: Use your production database
5. **CORS_ORIGIN**: Set to your actual domain(s)
6. **COOKIE_SECURE**: Set to `true` (requires HTTPS)
7. **NODE_ENV**: Set to `production`

### 5. Set Up MongoDB
- Ensure MongoDB is running and accessible
- Create the database if it doesn't exist
- Update `MONGODB_URI` with the correct connection string

### 6. Create Upload Directory
```bash
mkdir -p uploads/resumes
```

### 7. Start the Server

**For Production:**
```bash
npm start
```

**For Development:**
```bash
npm run dev
```

---

## Environment-Specific Configurations

### Development
- `NODE_ENV=development`
- `COOKIE_SECURE=false`
- `CORS_ORIGIN=http://localhost:5173,http://localhost:5174`

### Production
- `NODE_ENV=production`
- `COOKIE_SECURE=true` (requires HTTPS)
- `CORS_ORIGIN=https://yourdomain.com`
- Use strong, unique passwords and secrets

---

## Security Checklist

Before deploying to production, ensure:

- [ ] All environment variables are set in `.env`
- [ ] `.env` file is NOT committed to version control (check `.gitignore`)
- [ ] `JWT_SECRET` is changed to a strong random value
- [ ] Admin credentials (`ADMIN_EMAIL`, `ADMIN_PASSWORD`) are changed
- [ ] `CORS_ORIGIN` is set to your actual domain (not `*`)
- [ ] `NODE_ENV` is set to `production`
- [ ] `COOKIE_SECURE` is set to `true` (if using HTTPS)
- [ ] MongoDB connection string is secure
- [ ] File upload directory has proper permissions
- [ ] SSL/TLS certificate is configured (for HTTPS)

---

## Common Deployment Platforms

### Heroku
```bash
# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set NODE_ENV=production
# ... set all other variables
```

### Railway
- Add environment variables in the Railway dashboard
- Railway will automatically detect and use your `.env` variables

### DigitalOcean App Platform
- Add environment variables in the app settings
- Ensure MongoDB is accessible from your app

### AWS (EC2, Elastic Beanstalk)
- Use AWS Systems Manager Parameter Store or Secrets Manager
- Set environment variables in the application configuration

---

## Monitoring and Logs

- Monitor application logs for errors
- Set up error tracking (e.g., Sentry, LogRocket)
- Monitor MongoDB performance and connections
- Set up health check endpoints

---

## Backup Strategy

- Regularly backup your MongoDB database
- Keep backups of uploaded files in the `uploads` directory
- Version control your code (but NOT `.env`)

---

## Support

For issues or questions, refer to the project documentation or contact the development team.
