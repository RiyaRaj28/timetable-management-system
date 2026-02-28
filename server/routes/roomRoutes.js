const express = require('express');
const router = express.Router();
const { getAllRooms, createRoom } = require('../controllers/roomController');

// GET /api/rooms - List all rooms
router.get('/', getAllRooms);

// POST /api/rooms - Create a new room
router.post('/', createRoom);

module.exports = router;
