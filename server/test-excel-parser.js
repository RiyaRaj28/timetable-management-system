const xlsx = require('xlsx');
const excelParser = require('./utils/excelParser');

console.log('Testing Excel Parser...\n');

// Test 1: Valid Excel data
console.log('Test 1: Valid Excel data');
const validData = [
  { room: 'Room 101', day: 'Monday', slot: '9:00-10:00', department: 'Computer Science' },
  { room: 'Room 102', day: 'Tuesday', slot: '10:00-11:00', department: 'Mathematics' },
  { room: 'Room 103', day: 'Wednesday', slot: '11:00-12:00', department: 'Physics' }
];

const validWorksheet = xlsx.utils.json_to_sheet(validData);
const validWorkbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(validWorkbook, validWorksheet, 'Timetable');
const validBuffer = xlsx.write(validWorkbook, { type: 'buffer', bookType: 'xlsx' });

const result1 = excelParser.parse(validBuffer);
console.log('Result:', JSON.stringify(result1, null, 2));
console.log('Expected: success=true, 3 valid entries\n');

// Test 2: Missing required fields
console.log('Test 2: Missing required fields');
const invalidData = [
  { room: 'Room 101', day: 'Monday', slot: '9:00-10:00', department: 'Computer Science' },
  { room: '', day: 'Tuesday', slot: '10:00-11:00', department: 'Mathematics' }, // Missing room
  { room: 'Room 103', day: '', slot: '11:00-12:00', department: 'Physics' } // Missing day
];

const invalidWorksheet = xlsx.utils.json_to_sheet(invalidData);
const invalidWorkbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(invalidWorkbook, invalidWorksheet, 'Timetable');
const invalidBuffer = xlsx.write(invalidWorkbook, { type: 'buffer', bookType: 'xlsx' });

const result2 = excelParser.parse(invalidBuffer);
console.log('Result:', JSON.stringify(result2, null, 2));
console.log('Expected: success=false, errors for rows 3 and 4\n');

// Test 3: Invalid day format
console.log('Test 3: Invalid day format');
const invalidDayData = [
  { room: 'Room 101', day: 'InvalidDay', slot: '9:00-10:00', department: 'Computer Science' }
];

const invalidDayWorksheet = xlsx.utils.json_to_sheet(invalidDayData);
const invalidDayWorkbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(invalidDayWorkbook, invalidDayWorksheet, 'Timetable');
const invalidDayBuffer = xlsx.write(invalidDayWorkbook, { type: 'buffer', bookType: 'xlsx' });

const result3 = excelParser.parse(invalidDayBuffer);
console.log('Result:', JSON.stringify(result3, null, 2));
console.log('Expected: success=false, error for invalid day\n');

// Test 4: Empty Excel file
console.log('Test 4: Empty Excel file');
const emptyWorksheet = xlsx.utils.json_to_sheet([]);
const emptyWorkbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(emptyWorkbook, emptyWorksheet, 'Timetable');
const emptyBuffer = xlsx.write(emptyWorkbook, { type: 'buffer', bookType: 'xlsx' });

const result4 = excelParser.parse(emptyBuffer);
console.log('Result:', JSON.stringify(result4, null, 2));
console.log('Expected: success=false, error for empty sheet\n');

// Test 5: Valid data with optional fields
console.log('Test 5: Valid data with optional fields');
const dataWithOptional = [
  { 
    room: 'Room 101', 
    day: 'Monday', 
    slot: '9:00-10:00', 
    department: 'Computer Science',
    subjectCode: 'CS101',
    subjectName: 'Introduction to Programming',
    branch: 'CSE',
    section: 'A',
    teacher: 'Dr. Smith'
  }
];

const optionalWorksheet = xlsx.utils.json_to_sheet(dataWithOptional);
const optionalWorkbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(optionalWorkbook, optionalWorksheet, 'Timetable');
const optionalBuffer = xlsx.write(optionalWorkbook, { type: 'buffer', bookType: 'xlsx' });

const result5 = excelParser.parse(optionalBuffer);
console.log('Result:', JSON.stringify(result5, null, 2));
console.log('Expected: success=true, 1 entry with optional fields\n');

console.log('All tests completed!');
