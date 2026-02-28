import { useState } from 'react';
import axios from '../api/axios';

const AddRoomModal = ({ isOpen, onClose, onRoomAdded }) => {
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!roomName || roomName.trim() === '') {
      setError('Room name is required');
      return;
    }
    
    setIsAdding(true);
    
    try {
      const response = await axios.post('/rooms', { roomName: roomName.trim() });
      
      // Notify parent component that room was added
      if (onRoomAdded) {
        onRoomAdded(response.data);
      }
      
      // Reset and close
      setRoomName('');
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add room';
      setError(errorMessage);
    } finally {
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setRoomName('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add New Room</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Room 101, Lab A, Auditorium"
              required
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a unique room name or number
            </p>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isAdding}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={isAdding}
            >
              {isAdding ? 'Adding...' : 'Add Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomModal;
