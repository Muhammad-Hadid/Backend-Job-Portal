const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Get upload directory from environment or use default
const uploadDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads/resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Created uploads directory:', uploadDir);
}

// Configure storage - WHERE and HOW to save files
const storage = multer.diskStorage({
  // Destination: where to save the file
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save to uploads/resumes folder
  },
  
  // Filename: how to name the file
  filename: function (req, file, cb) {
    // Create unique filename: resume-1699500000-123456789.pdf
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname); // .pdf, .doc, etc.
    const filename = 'resume-' + uniqueSuffix + fileExtension;
    
    console.log('📁 Saving file as:', filename);
    cb(null, filename);
  }
});

// File filter - VALIDATE file types
const fileFilter = (req, file, cb) => {
  console.log('🔍 Checking file type:', file.mimetype);
  
  // Allowed MIME types
  const allowedTypes = [
    'application/pdf',                    // .pdf
    'application/msword',                 // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    console.log('✅ File type accepted');
    cb(null, true); // Accept file
  } else {
    console.log('❌ File type rejected');
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'), false);
  }
};

// Create multer instance with configuration
const upload = multer({
  storage: storage,           // Where and how to save
  fileFilter: fileFilter,     // Validate file type
  limits: {
    fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024 // Get from env or default 5MB
  }
});

// Export the upload middleware
module.exports = upload;
