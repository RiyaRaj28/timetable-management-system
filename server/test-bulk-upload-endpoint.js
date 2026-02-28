const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000';

async function testBulkUploadEndpoint() {
  console.log('Testing Bulk Upload Endpoint...\n');

  // Test 1: Upload without role header (should fail)
  console.log('Test 1: Upload without role header');
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(path.join(__dirname, 'test-files', 'valid-timetable.xlsx')));
    
    await axios.post(`${BASE_URL}/api/timetables/bulk-upload`, formData, {
      headers: formData.getHeaders()
    });
    console.log('❌ FAILED: Should have rejected request without role\n');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✓ PASSED: Correctly rejected request without role\n');
    } else {
      console.log(`❌ FAILED: Unexpected error: ${error.message}\n`);
    }
  }

  // Test 2: Upload with DEPARTMENT_ADMIN role (should fail)
  console.log('Test 2: Upload with DEPARTMENT_ADMIN role');
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(path.join(__dirname, 'test-files', 'valid-timetable.xlsx')));
    
    await axios.post(`${BASE_URL}/api/timetables/bulk-upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        'role': 'DEPARTMENT_ADMIN'
      }
    });
    console.log('❌ FAILED: Should have rejected DEPARTMENT_ADMIN\n');
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('✓ PASSED: Correctly rejected DEPARTMENT_ADMIN role\n');
    } else {
      console.log(`❌ FAILED: Unexpected error: ${error.message}\n`);
    }
  }

  // Test 3: Upload without file (should fail)
  console.log('Test 3: Upload without file');
  try {
    const formData = new FormData();
    
    await axios.post(`${BASE_URL}/api/timetables/bulk-upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        'role': 'INSTITUTE_ADMIN'
      }
    });
    console.log('❌ FAILED: Should have rejected request without file\n');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✓ PASSED: Correctly rejected request without file\n');
    } else {
      console.log(`❌ FAILED: Unexpected error: ${error.message}\n`);
    }
  }

  // Test 4: Upload valid Excel file with INSTITUTE_ADMIN role (should succeed)
  console.log('Test 4: Upload valid Excel file with INSTITUTE_ADMIN role');
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(path.join(__dirname, 'test-files', 'valid-timetable.xlsx')));
    
    const response = await axios.post(`${BASE_URL}/api/timetables/bulk-upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        'role': 'INSTITUTE_ADMIN'
      }
    });
    
    if (response.status === 200 && response.data.successful && response.data.successful.length === 3) {
      console.log('✓ PASSED: Successfully uploaded valid Excel file');
      console.log(`  - Uploaded ${response.data.successful.length} entries\n`);
    } else {
      console.log('❌ FAILED: Unexpected response format\n');
    }
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}\n`);
  }

  // Test 5: Upload invalid Excel file (should return validation errors)
  console.log('Test 5: Upload invalid Excel file');
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(path.join(__dirname, 'test-files', 'invalid-timetable.xlsx')));
    
    await axios.post(`${BASE_URL}/api/timetables/bulk-upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        'role': 'INSTITUTE_ADMIN'
      }
    });
    console.log('❌ FAILED: Should have returned validation errors\n');
  } catch (error) {
    if (error.response && error.response.status === 400 && error.response.data.errors) {
      console.log('✓ PASSED: Correctly returned validation errors');
      console.log(`  - Found ${error.response.data.errors.length} validation errors\n`);
    } else {
      console.log(`❌ FAILED: Unexpected error: ${error.message}\n`);
    }
  }

  console.log('All tests completed!');
}

// Check if server is running
axios.get(`${BASE_URL}/hello`)
  .then(() => {
    console.log('Server is running. Starting tests...\n');
    testBulkUploadEndpoint();
  })
  .catch(() => {
    console.log('❌ Server is not running. Please start the server first:');
    console.log('   cd server && npm start');
  });
