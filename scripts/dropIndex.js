const mongoose = require('mongoose');
require('dotenv').config();

// Import the Student model
const Student = require('../models/Student');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Drop the rollNumber index
async function dropIndex() {
  try {
    // Drop the index
    await Student.collection.dropIndex('rollNumber_1');
    
    console.log('Successfully dropped rollNumber index');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error dropping index:', error);
    await mongoose.connection.close();
  }
}

// Run the function
dropIndex(); 