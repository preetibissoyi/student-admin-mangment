const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const absolutePath = path.resolve(__dirname, '../uploads/students');
        cb(null, absolutePath);
    },
    filename: function (req, file, cb) {
        // Create unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

// Configure upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Middleware to handle file upload
const uploadMiddleware = (req, res, next) => {
    upload.single('photo')(req, res, (err) => {
        if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({ 
                message: err.message || 'Error uploading file',
                error: err.code
            });
        }
        if (req.file) {
            console.log("Uploaded file details:", req.file);
        }
        next();
    });
};

module.exports = uploadMiddleware;
