const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const studentRoutes = require('./routes/studentRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const studentPanelRoutes = require('./routes/studentPanelRoutes');

const app = express();

// CORS Configuration
app.use(cors({
    origin:'*', // Allow all origins
    credentials: true,
    optionsSuccessStatus: 200
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit the process if MongoDB connection fails
    });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', err);
    
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
