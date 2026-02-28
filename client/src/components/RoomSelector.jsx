import { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { TimetableContext } from '../context/TimetableContext';

const RoomSelector = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { selectedRoom, setSelectedRoom, fetchTimetables } = useContext(TimetableContext);

  // Fetch available rooms on mount
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get('/rooms');
        setRooms(response.data);
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch rooms';
        setError(errorMessage);
        console.error('Error fetching rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Handle room selection
  const handleRoomChange = async (e) => {
    const roomValue = e.target.value;
    const newSelectedRoom = roomValue === '' ? null : roomValue;
    
    setSelectedRoom(newSelectedRoom);
    
    // Fetch timetables with the new room filter
    try {
      await fetchTimetables(newSelectedRoom);
    } catch (err) {
      console.error('Error fetching timetables:', err);
    }
  };

  if (error) {
    return (
      <div className="text-red-600 text-sm">
        Error loading rooms: {error}
      </div>
    );
  }

  return (
    <div className="room-selector-container">
      <label htmlFor="room-select" className="block text-sm font-medium text-gray-700 mb-2">
        Filter by Room
      </label>
      <select
        id="room-select"
        className="room-selector w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={selectedRoom || ''}
        onChange={handleRoomChange}
        disabled={loading}
      >
        <option value="">All Rooms</option>
        {rooms.map((room) => (
          <option key={room._id} value={room.roomName}>
            {room.roomName}
          </option>
        ))}
      </select>
      {loading && (
        <p className="text-sm text-gray-500 mt-1">Loading rooms...</p>
      )}
    </div>
  );
};

export default RoomSelector;
