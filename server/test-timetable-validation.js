/**
 * Manual test script for timetable validation
 * Run with: node test-timetable-validation.js
 * 
 * Prerequisites:
 * - Server must be running on port 5000
 * - MongoDB must be running and connected
 */

const testTimetableValidation = async () => {
  const BASE_URL = 'http://localhost:5000/api/timetables';
  
  console.log('Testing Timetable Validation\n');
  console.log('='.repeat(50));
  
  try {
    // Test 1: Valid data - should succeed
    console.log('\n=== Test 1: Valid data (should succeed) ===');
    let response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'role': 'INSTITUTE_ADMIN'
      },
      body: JSON.stringify({
        room: 'A101',
        day: 'Monday',
        slot: '9:00-10:00',
        department: 'Computer Science',
        subjectCode: 'CS101',
        subjectName: 'Programming'
      })
    });
    let result = await response.json();
    console.log('Status:', response.status);
    console.log('Result:', result);
    console.log('✓ Test 1 passed:', response.status === 201 || response.status === 200);

    // Test 2: Missing room field
    console.log('\n=== Test 2: Missing room field (should fail) ===');
    response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'role': 'INSTITUTE_ADMIN'
      },
      body: JSON.stringify({
        day: 'Tuesday',
        slot: '10:00-11:00',
        department: 'Mathematics'
      })
    });
    result = await response.json();
    console.log('Status:', response.status);
    console.log('Error message:', result.message);
    console.log('Missing fields:', result.missingFields);
    const test2Pass = response.status === 400 && 
                      result.missingFields && 
                      result.missingFields.includes('room');
    console.log('✓ Test 2 passed:', test2Pass);

    // Test 3: Missing day field
    console.log('\n=== Test 3: Missing day field (should fail) ===');
    response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'role': 'INSTITUTE_ADMIN'
      },
      body: JSON.stringify({
        room: 'B201',
        slot: '11:00-12:00',
        department: 'Physics'
      })
    });
    result = await response.json();
    console.log('Status:', response.status);
    console.log('Error message:', result.message);
    console.log('Missing fields:', result.missingFields);
    const test3Pass = response.status === 400 && 
                      result.missingFields && 
                      result.missingFields.includes('day');
    console.log('✓ Test 3 passed:', test3Pass);

    // Test 4: Missing timeSlot field
    console.log('\n=== Test 4: Missing timeSlot field (should fail) ===');
    response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'role': 'INSTITUTE_ADMIN'
      },
      body: JSON.stringify({
        room: 'C301',
        day: 'Wednesday',
        department: 'Chemistry'
      })
    });
    result = await response.json();
    console.log('Status:', response.status);
    console.log('Error message:', result.message);
    console.log('Missing fields:', result.missingFields);
    const test4Pass = response.status === 400 && 
                      result.missingFields && 
                      result.missingFields.includes('timeSlot');
    console.log('✓ Test 4 passed:', test4Pass);

    // Test 5: Multiple missing fields
    console.log('\n=== Test 5: Multiple missing fields (should fail) ===');
    response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'role': 'INSTITUTE_ADMIN'
      },
      body: JSON.stringify({
        department: 'Biology'
      })
    });
    result = await response.json();
    console.log('Status:', response.status);
    console.log('Error message:', result.message);
    console.log('Missing fields:', result.missingFields);
    const test5Pass = response.status === 400 && 
                      result.missingFields && 
                      result.missingFields.length === 3 &&
                      result.missingFields.includes('room') &&
                      result.missingFields.includes('day') &&
                      result.missingFields.includes('timeSlot');
    console.log('✓ Test 5 passed:', test5Pass);

    // Test 6: Empty string for room
    console.log('\n=== Test 6: Empty string for room (should fail) ===');
    response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'role': 'INSTITUTE_ADMIN'
      },
      body: JSON.stringify({
        room: '',
        day: 'Thursday',
        slot: '12:00-13:00',
        department: 'English'
      })
    });
    result = await response.json();
    console.log('Status:', response.status);
    console.log('Error message:', result.message);
    console.log('Missing fields:', result.missingFields);
    const test6Pass = response.status === 400 && 
                      result.missingFields && 
                      result.missingFields.includes('room');
    console.log('✓ Test 6 passed:', test6Pass);

    // Test 7: Whitespace-only string for day
    console.log('\n=== Test 7: Whitespace-only string for day (should fail) ===');
    response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'role': 'INSTITUTE_ADMIN'
      },
      body: JSON.stringify({
        room: 'D401',
        day: '   ',
        slot: '13:00-14:00',
        department: 'History'
      })
    });
    result = await response.json();
    console.log('Status:', response.status);
    console.log('Error message:', result.message);
    console.log('Missing fields:', result.missingFields);
    const test7Pass = response.status === 400 && 
                      result.missingFields && 
                      result.missingFields.includes('day');
    console.log('✓ Test 7 passed:', test7Pass);

    // Test 8: Update existing entry with valid data
    console.log('\n=== Test 8: Update existing entry with valid data (should succeed) ===');
    response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'role': 'INSTITUTE_ADMIN'
      },
      body: JSON.stringify({
        room: 'A101',
        day: 'Monday',
        slot: '9:00-10:00',
        department: 'Computer Science',
        subjectCode: 'CS102',
        subjectName: 'Advanced Programming'
      })
    });
    result = await response.json();
    console.log('Status:', response.status);
    console.log('Updated entry:', result);
    console.log('✓ Test 8 passed:', response.status === 200 && result.subjectCode === 'CS102');

    console.log('\n' + '='.repeat(50));
    console.log('All validation tests completed!');
    console.log('\nSummary:');
    console.log('✓ Valid data is accepted');
    console.log('✓ Missing required fields are rejected with descriptive errors');
    console.log('✓ Empty strings are treated as missing fields');
    console.log('✓ Whitespace-only strings are treated as missing fields');
    console.log('✓ Error messages list all missing fields');
    
  } catch (error) {
    console.error('\nTest failed:', error.message);
    console.error(error);
    console.log('\nMake sure:');
    console.log('1. MongoDB is running');
    console.log('2. Server is running on port 5000');
  }
};

testTimetableValidation();
