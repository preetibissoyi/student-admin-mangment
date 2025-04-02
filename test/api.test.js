const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let adminToken = '';
let studentToken = '';

// Test data
const testAdmin = {
    email: 'admin@example.com',
    password: 'admin123'
};

const testStudent = {
    email: 'student@example.com',
    password: 'password123'
};

const students = [
    {
        studentName: 'Test Student 1',
        email: 'student1@example.com',
        password: 'password123',
        collegeRollNumber: 'CR001',
        examRollNumber: 'ER001',
        programType: 'UG',
        stream: 'Computer Science',
        batch: '2023'
    },
    {
        studentName: 'Test Student 2',
        email: 'student2@example.com',
        password: 'password123',
        collegeRollNumber: 'CR002',
        examRollNumber: 'ER002',
        programType: 'UG',
        stream: 'Computer Science',
        batch: '2023'
    },
    {
        studentName: 'Test Student 3',
        email: 'student3@example.com',
        password: 'password123',
        collegeRollNumber: 'CR003',
        examRollNumber: 'ER003',
        programType: 'UG',
        stream: 'Computer Science',
        batch: '2023'
    }
];

// Test student registration data
const studentData = {
    studentName: 'Test Student',
    email: 'test.student@example.com',
    password: 'password123',
    collegeRollNumber: 'TEST001',
    examRollNumber: 'EXAM001',
    batch: '2023',
    stream: 'Computer Science'
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
    if (config.url.includes('/admin')) {
        if (adminToken) {
            config.headers.Authorization = `Bearer ${adminToken}`;
        }
    } else if (config.url.includes('/student')) {
        if (studentToken) {
            config.headers.Authorization = `Bearer ${studentToken}`;
        }
    }
    return config;
});

// Admin Tests
async function testAdminLogin() {
    try {
        console.log('\n🔐 Testing Admin Login...');
        console.log('Login attempt with:', { email: testAdmin.email });
        
        const response = await api.post('/admin/login', testAdmin);
        console.log('Login response:', response.data);
        
        if (response.data.success) {
            adminToken = response.data.token;
            console.log('✅ Admin login successful');
            console.log('Token received:', adminToken);
            return true;
        } else {
            console.log('❌ Admin login failed');
            console.log('Error:', response.data.message);
            return false;
        }
    } catch (error) {
        console.log('❌ Admin login failed');
        if (error.response) {
            console.log('Error response:', error.response.data);
        } else if (error.request) {
            console.log('No response received:', error.request);
        } else {
            console.log('Error:', error.message);
        }
        return false;
    }
}

async function testCreateStudents() {
    console.log('\n👥 Testing Create Multiple Students...');
    let successCount = 0;
    
    for (const student of students) {
        try {
            console.log(`\nCreating student: ${student.studentName}`);
            const response = await api.post('/students/register', student);
            
            if (response.data.success) {
                console.log('✅ Student created successfully');
                console.log('Created student:', response.data.data);
                successCount++;
            }
        } catch (error) {
            console.log('❌ Failed to create student');
            if (error.response) {
                console.log('Error response:', error.response.data);
            } else if (error.request) {
                console.log('No response received:', error.request);
            } else {
                console.log('Error:', error.message);
            }
        }
    }
    
    console.log(`\nCreated ${successCount} out of ${students.length} students`);
    return successCount > 0;
}

// Student Tests
async function testStudentLogin() {
    try {
        console.log('\n🔐 Testing Student Login...');
        const response = await api.post('/student/login', testStudent);
        
        if (response.data.success) {
            studentToken = response.data.token;
            console.log('✅ Student login successful');
            return true;
        }
    } catch (error) {
        console.log('❌ Student login failed');
        if (error.response) {
            console.log('Error response:', error.response.data);
        } else if (error.request) {
            console.log('No response received:', error.request);
        } else {
            console.log('Error:', error.message);
        }
        return false;
    }
}

async function testGetStudentProfile() {
    try {
        console.log('\n👤 Testing Get Student Profile...');
        const response = await api.get('/student/profile');
        
        if (response.data.success) {
            console.log('✅ Get profile successful');
            console.log('Profile data:', response.data.data);
            return true;
        }
    } catch (error) {
        console.log('❌ Get profile failed');
        if (error.response) {
            console.log('Error response:', error.response.data);
        } else if (error.request) {
            console.log('No response received:', error.request);
        } else {
            console.log('Error:', error.message);
        }
        return false;
    }
}

async function testGetStudentMarks() {
    try {
        console.log('\n📊 Testing Get Student Marks...');
        const response = await api.get('/student/marks');
        
        if (response.data.success) {
            console.log('✅ Get marks successful');
            console.log('Marks data:', response.data.data);
            return true;
        }
    } catch (error) {
        console.log('❌ Get marks failed');
        if (error.response) {
            console.log('Error response:', error.response.data);
        } else if (error.request) {
            console.log('No response received:', error.request);
        } else {
            console.log('Error:', error.message);
        }
        return false;
    }
}

async function testGetExamCard() {
    try {
        console.log('\n🎫 Testing Get Exam Card...');
        const response = await api.get('/student/exam-card');
        
        if (response.data.success) {
            console.log('✅ Get exam card successful');
            console.log('Exam card data:', response.data.data);
            return true;
        }
    } catch (error) {
        console.log('❌ Get exam card failed');
        if (error.response) {
            console.log('Error response:', error.response.data);
        } else if (error.request) {
            console.log('No response received:', error.request);
        } else {
            console.log('Error:', error.message);
        }
        return false;
    }
}

// Run all tests
async function runTests() {
    console.log('🚀 Starting API Tests...\n');

    // Test Admin APIs
    console.log('=== Admin API Tests ===');
    const adminLoginSuccess = await testAdminLogin();
    if (adminLoginSuccess) {
        await testCreateStudents();
    }

    // Test Student APIs
    console.log('\n=== Student API Tests ===');
    const studentLoginSuccess = await testStudentLogin();
    if (studentLoginSuccess) {
        await testGetStudentProfile();
        await testGetStudentMarks();
        await testGetExamCard();
    }

    console.log('\n✨ All tests completed!');
}

// Run the tests
runTests().catch(error => {
    console.error('Test suite failed:', error);
}); 