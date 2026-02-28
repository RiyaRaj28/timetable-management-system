const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

console.log('Creating test Excel files for bulk upload...\n');

// Create test directory if it doesn't exist
const testDir = path.join(__dirname, 'test-files');
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir);
}

// Test file 1: Valid data
console.log('Creating valid-timetable.xlsx...');
const validData = [
  { 
    room: 'Room 101', 
    day: 'Monday', 
    slot: '9:00-10:00', 
    department: 'Computer Science',
    subjectCode: 'CS101',
    subjectName: 'Data Structures',
    teacher: 'Dr. Smith'
  },
  { 
    room: 'Room 102', 
    day: 'Tuesday', 
    slot: '10:00-11:00', 
    department: 'Mathematics',
    subjectCode: 'MATH201',
    subjectName: 'Calculus',
    teacher: 'Prof. Johnson'
  },
  { 
    room: 'Room 103', 
    day: 'Wednesday', 
    slot: '11:00-12:00', 
    department: 'Physics',
    subjectCode: 'PHY301',
    subjectName: 'Quantum Mechanics',
    teacher: 'Dr. Brown'
  }
];

const validWorksheet = xlsx.utils.json_to_sheet(validData);
const validWorkbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(validWorkbook, validWorksheet, 'Timetable');
xlsx.writeFile(validWorkbook, path.join(testDir, 'valid-timetable.xlsx'));
console.log('✓ Created valid-timetable.xlsx with 3 entries\n');

// Test file 2: Invalid data (missing required fields)
console.log('Creating invalid-timetable.xlsx...');
const invalidData = [
  { 
    room: 'Room 101', 
    day: 'Monday', 
    slot: '9:00-10:00', 
    department: 'Computer Science'
  },
  { 
    room: '', // Missing room
    day: 'Tuesday', 
    slot: '10:00-11:00', 
    department: 'Mathematics'
  },
  { 
    room: 'Room 103', 
    day: '', // Missing day
    slot: '11:00-12:00', 
    department: 'Physics'
  },
  { 
    room: 'Room 104', 
    day: 'InvalidDay', // Invalid day
    slot: '12:00-13:00', 
    department: 'Chemistry'
  }
];

const invalidWorksheet = xlsx.utils.json_to_sheet(invalidData);
const invalidWorkbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(invalidWorkbook, invalidWorksheet, 'Timetable');
xlsx.writeFile(invalidWorkbook, path.join(testDir, 'invalid-timetable.xlsx'));
console.log('✓ Created invalid-timetable.xlsx with validation errors\n');

// Test file 3: Mixed valid and invalid data
console.log('Creating mixed-timetable.xlsx...');
const mixedData = [
  { 
    room: 'Room 201', 
    day: 'Monday', 
    slot: '9:00-10:00', 
    department: 'Computer Science'
  },
  { 
    room: '', // Invalid
    day: 'Tuesday', 
    slot: '10:00-11:00', 
    department: 'Mathematics'
  },
  { 
    room: 'Room 203', 
    day: 'Wednesday', 
    slot: '11:00-12:00', 
    department: 'Physics'
  }
];

const mixedWorksheet = xlsx.utils.json_to_sheet(mixedData);
const mixedWorkbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(mixedWorkbook, mixedWorksheet, 'Timetable');
xlsx.writeFile(mixedWorkbook, path.join(testDir, 'mixed-timetable.xlsx'));
console.log('✓ Created mixed-timetable.xlsx with 2 valid and 1 invalid entry\n');

console.log('Test files created successfully!');
console.log('\nTo test the bulk upload endpoint:');
console.log('1. Start the server: npm start');
console.log('2. Use curl or Postman to POST to http://localhost:5000/api/timetables/bulk-upload');
console.log('3. Include the file as form-data with key "file"');
console.log('4. Add header: role: INSTITUTE_ADMIN');
console.log('\nExample curl command:');
console.log('curl -X POST http://localhost:5000/api/timetables/bulk-upload \\');
console.log('  -H "role: INSTITUTE_ADMIN" \\');
console.log('  -F "file=@test-files/valid-timetable.xlsx"');
