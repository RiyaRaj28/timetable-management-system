const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomName: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Room', roomSchema);
