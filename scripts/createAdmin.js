const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Check if admin exists
        const adminExists = await Admin.findOne({ email: 'admin@example.com' });
        
        if (adminExists) {
            console.log('Admin already exists');
            console.log('Email:', adminExists.email);
            return;
        }

        // Create admin
        const admin = await Admin.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin'
        });

        console.log('Admin created successfully');
        console.log('Email:', admin.email);
        console.log('Password: admin123');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
};

createAdmin(); 