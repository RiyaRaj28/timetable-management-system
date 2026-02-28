const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['INSTITUTE_ADMIN', 'DEPARTMENT_ADMIN'],
    required: true
  },
  department: { type: String }
});

module.exports = mongoose.model('Admin', adminSchema);
