const Room = require('../models/Room');

// GET /api/rooms - List all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ roomName: 1 });
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Failed to fetch rooms', error: error.message });
  }
};

// POST /api/rooms - Create a new room
exports.createRoom = async (req, res) => {
  try {
    const { roomName } = req.body;

    if (!roomName || roomName.trim() === '') {
      return res.status(400).json({ message: 'Room name is required' });
    }

    const existingRoom = await Room.findOne({ roomName: roomName.trim() });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room already exists' });
    }

    const room = new Room({ roomName: roomName.trim() });
    await room.save();

    res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Failed to create room', error: error.message });
  }
};
