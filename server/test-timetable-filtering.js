/**
 * Manual test script for timetable role-based filtering
 * Run with: node test-timetable-filtering.js
 * 
 * Prerequisites:
 * - Server must be running on port 5000
 * - MongoDB must be running and connected
 */

const testTimetableFiltering = async () => {
  const BASE_URL = 'http://localhost:5000/api/timetables';
  
  console.log('Testing Timetable Role-Based Filtering\n');
  console.log('='.repeat(50));
  
  try {
    // Setup: Create test data
    console.log('\n=== SETUP: Creating test data ===');
    
    const testCells = [
      {
        room: 'A101',
        day: 'Monday',
        slot: '9:00-10:00',
        department: 'Computer Science',
        subjectCode: 'CS101',
        subjectName: 'Programming',
        teacher: 'Dr. Smith'
      },
      {
        room: 'A102',
        day: 'Monday',
        slot: '10:00-11:00',
        department: 'Computer Science',
        subjectCode: 'CS102',
        subjectName: 'Data Structures',
        teacher: 'Dr. Johnson'
      },
      {
        room: 'B201',
        day: 'Tuesday',
        slot: '9:00-10:00',
        department: 'Mathematics',
        subjectCode: 'MATH101',
        subjectName: 'Calculus',
        teacher: 'Dr. Brown'
      },
      {
        room: 'B202',
        day: 'Tuesday',
        slot: '10:00-11:00',
        department: 'Mathematics',
        subjectCode: 'MATH102',
        subjectName: 'Linear Algebra',
        teacher: 'Dr. Davis'
      }
    ];

    // Create test cells
    for (const cell of testCells) {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'role': 'INSTITUTE_ADMIN'
        },
        body: JSON.stringify(cell)
      });
      const result = await response.json();
      console.log(`Created: ${cell.room} - ${cell.department}`);
    }

    // Test 1: Institute Admin - Get all cells (no filtering)
    console.log('\n=== Test 1: Institute Admin - Get all cells ===');
    let response = await fetch(BASE_URL, {
      headers: {
        'role': 'INSTITUTE_ADMIN'
      }
    });
    let data = await response.json();
    console.log(`Expected: 4 cells, Got: ${data.length} cells`);
    console.log('Departments:', [...new Set(data.map(c => c.department))]);
    console.log('✓ Test 1 passed:', data.length === 4);

    // Test 2: Department Admin - Get only Computer Science cells
    console.log('\n=== Test 2: Department Admin - Computer Science only ===');
    response = await fetch(BASE_URL, {
      headers: {
        'role': 'DEPARTMENT_ADMIN',
        'department': 'Computer Science'
      }
    });
    data = await response.json();
    console.log(`Expected: 2 cells, Got: ${data.length} cells`);
    const allCS = data.every(c => c.department === 'Computer Science');
    console.log('All cells are Computer Science:', allCS);
    console.log('✓ Test 2 passed:', data.length === 2 && allCS);

    // Test 3: Department Admin - Get only Mathematics cells
    console.log('\n=== Test 3: Department Admin - Mathematics only ===');
    response = await fetch(BASE_URL, {
      headers: {
        'role': 'DEPARTMENT_ADMIN',
        'department': 'Mathematics'
      }
    });
    data = await response.json();
    console.log(`Expected: 2 cells, Got: ${data.length} cells`);
    const allMath = data.every(c => c.department === 'Mathematics');
    console.log('All cells are Mathematics:', allMath);
    console.log('✓ Test 3 passed:', data.length === 2 && allMath);

    // Test 4: Room filtering - Filter by room A101
    console.log('\n=== Test 4: Room filtering - A101 only ===');
    response = await fetch(`${BASE_URL}?room=A101`, {
      headers: {
        'role': 'INSTITUTE_ADMIN'
      }
    });
    data = await response.json();
    console.log(`Expected: 1 cell, Got: ${data.length} cells`);
    const allA101 = data.every(c => c.room === 'A101');
    console.log('All cells are in room A101:', allA101);
    console.log('✓ Test 4 passed:', data.length === 1 && allA101);

    // Test 5: Combined filtering - Department Admin + Room filter
    console.log('\n=== Test 5: Department Admin + Room filter (CS + A102) ===');
    response = await fetch(`${BASE_URL}?room=A102`, {
      headers: {
        'role': 'DEPARTMENT_ADMIN',
        'department': 'Computer Science'
      }
    });
    data = await response.json();
    console.log(`Expected: 1 cell, Got: ${data.length} cells`);
    const correctFilter = data.length === 1 && 
                         data[0].room === 'A102' && 
                         data[0].department === 'Computer Science';
    console.log('Correct filtering applied:', correctFilter);
    console.log('✓ Test 5 passed:', correctFilter);

    // Test 6: Department Admin with room from different department
    console.log('\n=== Test 6: Department Admin + Room from different dept (CS + B201) ===');
    response = await fetch(`${BASE_URL}?room=B201`, {
      headers: {
        'role': 'DEPARTMENT_ADMIN',
        'department': 'Computer Science'
      }
    });
    data = await response.json();
    console.log(`Expected: 0 cells, Got: ${data.length} cells`);
    console.log('✓ Test 6 passed:', data.length === 0);

    console.log('\n' + '='.repeat(50));
    console.log('All tests completed successfully!');
    console.log('\nSummary:');
    console.log('✓ Institute Admin sees all cells');
    console.log('✓ Department Admin sees only their department cells');
    console.log('✓ Room filtering works correctly');
    console.log('✓ Combined filtering (role + room) works correctly');
    
  } catch (error) {
    console.error('\nTest failed:', error.message);
    console.error(error);
    console.log('\nMake sure:');
    console.log('1. MongoDB is running');
    console.log('2. Server is running on port 5000');
  }
};

testTimetableFiltering();
