const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Determine uploads directory - use environment variable or create in project root
const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Created uploads directory: ${uploadsDir}`);
}

console.log(`Using uploads directory: ${uploadsDir}`);

// Use disk storage instead of memory storage to avoid loading entire files into RAM
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      path.basename(file.originalname, path.extname(file.originalname)) +
        '-' +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});

// Memory limits for 1GB instance: max 5MB per file, 20MB total for safety
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB per file
    files: 5, // max 5 files per request
  },
});

module.exports = upload;
