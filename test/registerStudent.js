const axios = require('axios');

// Function to register a student
const registerStudent = async () => {
    try {
        // Replace with your actual admin token
        const adminToken = 'YOUR_ADMIN_TOKEN_HERE';
        
        // Student data
        const studentData = {
            studentName: "John Doe",
            email: "john.doe@example.com",
            password: "password123",
            collegeRollNumber: "COLL123",
            examRollNumber: "EXAM123",
            programType: "UG",
            stream: "Computer Science",
            batch: "2024"
        };

        // Make the request
        const response = await axios.post('http://localhost:5000/api/students/register', studentData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            }
        });

        console.log('Registration successful!');
        console.log('Response:', response.data);

    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error response:', {
                status: error.response.status,
                data: error.response.data
            });
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error:', error.message);
        }
    }
};

// Run the registration
registerStudent(); 