const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  room: { type: String, required: true },
  day: { type: String, required: true },
  slot: { type: String, required: true },

  department: { type: String, required: true },

  subjectCode: String,
  subjectName: String,
  branch: String,
  section: String,
  teacher: String
});

module.exports = mongoose.model('Timetable', timetableSchema);
