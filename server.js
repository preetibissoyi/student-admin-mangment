const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const studentRoutes = require('./routes/studentRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const studentPanelRoutes = require('./routes/studentPanelRoutes');

const app = express();

// CORS Configuration with specific options for student registration
app.use(cors({
    origin: process.env.CLIENT_URL || '*', // Use environment variable for client URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
}));

// Middleware
app.use(express.json({ limit: '10mb' })); // Increased limit for handling larger payloads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/student', studentPanelRoutes);

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// MongoDB Connection with better error handling
console.log('Attempting to connect to MongoDB...');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error('MongoDB URI is not defined in environment variables');
    process.exit(1);
}

console.log('Using MongoDB URI from environment variables');

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => {
    console.log('Connected to MongoDB successfully');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', err);
    
    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'fail',
            message: Object.values(err.errors).map(error => error.message)
        });
    }

    // Handle mongoose duplicate key errors
    if (err.code === 11000) {
        return res.status(400).json({
            status: 'fail',
            message: 'Duplicate field value entered'
        });
    }

    // Handle multer errors
    if (err.name === 'MulterError') {
        return res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }

    res.status(err.statusCode || 500).json({
        status: 'fail',
        message: err.message || 'Something went wrong!'
    });
});

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Test the API at http://localhost:${PORT}/api/test`);
    console.log(`Student registration endpoint: http://localhost:${PORT}/api/students/register`);
});

// Graceful shutdown handling
const gracefulShutdown = () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
