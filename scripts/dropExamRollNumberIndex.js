const mongoose = require('mongoose');
require('dotenv').config();

async function dropExamRollNumberIndex() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Get the Student model
        const Student = require('../models/Student');

        // Drop the examRollNumber index
        await Student.collection.dropIndex('examRollNumber_1');
        console.log('Successfully dropped examRollNumber index');

        // List remaining indexes to verify
        const indexes = await Student.collection.indexes();
        console.log('Remaining indexes:', JSON.stringify(indexes, null, 2));

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

dropExamRollNumberIndex(); 