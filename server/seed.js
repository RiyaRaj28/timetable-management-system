const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Timetable = require('./models/Timetable');
const Room = require('./models/Room');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await Timetable.deleteMany({});
    await Room.deleteMany({});
    console.log('Cleared existing data');

    // Create rooms
const rooms = [
  { roomName: 'A101' },
  { roomName: 'A102' },
  { roomName: 'B201' },
  { roomName: 'B202' },
  { roomName: 'C301' }
];
    await Room.insertMany(rooms);
    console.log('Rooms created');

    // Create sample timetable entries
    const timetableEntries = [
      {
        room: 'A101',
        day: 'Monday',
        slot: '9:00-10:00',
        department: 'Computer Science',
        subjectCode: 'CS101',
        subjectName: 'Data Structures',
        branch: 'CSE',
        section: 'A',
        teacher: 'Dr. Smith'
      },
      {
        room: 'A101',
        day: 'Monday',
        slot: '10:00-11:00',
        department: 'Computer Science',
        subjectCode: 'CS102',
        subjectName: 'Algorithms',
        branch: 'CSE',
        section: 'A',
        teacher: 'Prof. Johnson'
      },
      {
        room: 'A102',
        day: 'Tuesday',
        slot: '9:00-10:00',
        department: 'Mathematics',
        subjectCode: 'MATH201',
        subjectName: 'Linear Algebra',
        branch: 'MATH',
        section: 'B',
        teacher: 'Dr. Williams'
      },
      {
        room: 'B201',
        day: 'Wednesday',
        slot: '11:00-12:00',
        department: 'Physics',
        subjectCode: 'PHY301',
        subjectName: 'Quantum Mechanics',
        branch: 'PHY',
        section: 'A',
        teacher: 'Prof. Brown'
      },
      {
        room: 'A101',
        day: 'Thursday',
        slot: '14:00-15:00',
        department: 'Computer Science',
        subjectCode: 'CS201',
        subjectName: 'Database Systems',
        branch: 'CSE',
        section: 'B',
        teacher: 'Dr. Davis'
      },
      {
        room: 'B202',
        day: 'Friday',
        slot: '10:00-11:00',
        department: 'Mathematics',
        subjectCode: 'MATH301',
        subjectName: 'Calculus III',
        branch: 'MATH',
        section: 'A',
        teacher: 'Prof. Miller'
      }
    ];

    await Timetable.insertMany(timetableEntries);
    console.log('Timetable entries created');
    console.log(`Created ${timetableEntries.length} timetable entries`);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

connectDB().then(seedData);
