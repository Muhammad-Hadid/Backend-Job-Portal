require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT ;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/database");
const authroutes = require("./Router/auth.routes");
const jobsrouter = require("./Router/jobs.routes");
const applicationRoutes = require("./Router/application.routes");

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(cookieParser());

// Serve uploaded files statically
// This allows accessing files via: http://localhost:3000/uploads/resumes/filename.pdf
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('📁 Serving static files from:', path.join(__dirname, 'uploads'));

// CORS configuration - must come before routes
const corsOptions = {
  origin: function (origin, callback) {
    // Parse CORS origins from environment variable
    const corsOriginsEnv = process.env.CORS_ORIGIN || '';
    const allowedOrigins = corsOriginsEnv.split(',').map(o => o.trim()).filter(Boolean);
    
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/auth", authroutes);
app.use("/jobs", jobsrouter);
app.use("/applications", applicationRoutes);

app.listen(port, () =>
  console.log(`Server is running at  http://localhost:${port}`)
);
