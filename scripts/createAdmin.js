const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const createTestAdmin = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('MongoDB URI:', process.env.MONGO_URI ? 'Present' : 'Missing');
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const adminData = {
            name: 'Test Admin',
            email: 'admin@test.com',
            password: 'password123',
            role: 'admin'
        };

        const existingAdmin = await Admin.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit(0);
        }

        const admin = await Admin.create(adminData);
        console.log('Test admin created successfully:', admin);
        process.exit(0);
    } catch (error) {
        console.error('Error creating test admin:', error);
        process.exit(1);
    }
};

createTestAdmin(); 