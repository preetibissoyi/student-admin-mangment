const mongoose = require('mongoose');
require('dotenv').config();

async function listIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get the Student model
    const Student = require('../models/Student');

    // List all indexes
    const indexes = await Student.collection.indexes();
    console.log('Current indexes:', JSON.stringify(indexes, null, 2));

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

listIndexes(); 