const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

// Test data
const testStudent = {
    email: 'test@example.com',
    password: 'password123'
};

// Helper function to make API calls
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if available
api.interceptors.request.use(config => {
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
});

// Test student login
async function testLogin() {
    try {
        console.log('\nTesting Student Login...');
        const response = await api.post('/student/login', testStudent);
        
        if (response.data.success) {
            authToken = response.data.token;
            console.log('✅ Login successful');
            console.log('Token received:', authToken);
            return true;
        }
    } catch (error) {
        console.log('❌ Login failed');
        console.log('Error:', error.response?.data?.message || error.message);
        return false;
    }
}

// Test get profile
async function testGetProfile() {
    try {
        console.log('\nTesting Get Profile...');
        const response = await api.get('/student/profile');
        
        if (response.data.success) {
            console.log('✅ Get profile successful');
            console.log('Profile data:', response.data.data);
            return true;
        }
    } catch (error) {
        console.log('❌ Get profile failed');
        console.log('Error:', error.response?.data?.message || error.message);
        return false;
    }
}

// Test get marks
async function testGetMarks() {
    try {
        console.log('\nTesting Get Marks...');
        const response = await api.get('/student/marks');
        
        if (response.data.success) {
            console.log('✅ Get marks successful');
            console.log('Marks data:', response.data.data);
            return true;
        }
    } catch (error) {
        console.log('❌ Get marks failed');
        console.log('Error:', error.response?.data?.message || error.message);
        return false;
    }
}

// Test get exam card
async function testGetExamCard() {
    try {
        console.log('\nTesting Get Exam Card...');
        const response = await api.get('/student/exam-card');
        
        if (response.data.success) {
            console.log('✅ Get exam card successful');
            console.log('Exam card data:', response.data.data);
            return true;
        }
    } catch (error) {
        console.log('❌ Get exam card failed');
        console.log('Error:', error.response?.data?.message || error.message);
        return false;
    }
}

// Run all tests
async function runTests() {
    console.log('🚀 Starting API Tests...\n');

    // First test login
    const loginSuccess = await testLogin();
    if (!loginSuccess) {
        console.log('\n❌ Login failed. Stopping further tests.');
        return;
    }

    // If login successful, test other endpoints
    await testGetProfile();
    await testGetMarks();
    await testGetExamCard();

    console.log('\n✨ All tests completed!');
}

// Run the tests
runTests().catch(error => {
    console.error('Test suite failed:', error);
}); 