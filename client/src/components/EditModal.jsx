import React, { useState, useEffect, useContext } from 'react';
import { TimetableContext } from '../context/TimetableContext';

const EditModal = ({ isOpen, onClose, cellData }) => {
  const { createCell, updateCell, error, setError } = useContext(TimetableContext);
  
  const [formData, setFormData] = useState({
    room: '',
    day: '',
    slot: '',
    department: '',
    subjectCode: '',
    subjectName: '',
    branch: '',
    section: '',
    teacher: ''
  });
  
  const [localError, setLocalError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Pre-populate form when editing existing cell
  useEffect(() => {
    if (cellData) {
      setFormData({
        room: cellData.room || '',
        day: cellData.day || '',
        slot: cellData.slot || '',
        department: cellData.department || '',
        subjectCode: cellData.subjectCode || '',
        subjectName: cellData.subjectName || '',
        branch: cellData.branch || '',
        section: cellData.section || '',
        teacher: cellData.teacher || ''
      });
    } else {
      // Reset form for new cell
      setFormData({
        room: '',
        day: '',
        slot: '',
        department: '',
        subjectCode: '',
        subjectName: '',
        branch: '',
        section: '',
        teacher: ''
      });
    }
    setLocalError(null);
    setError(null);
  }, [cellData, isOpen, setError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setError(null);
    
    // Validate required fields
    if (!formData.room || !formData.day || !formData.slot || !formData.department) {
      setLocalError('Room, day, time slot, and department are required fields');
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (cellData && cellData._id) {
        // Update existing cell
        await updateCell(cellData._id, formData);
      } else {
        // Create new cell
        await createCell(formData);
      }
      
      // Close modal on success
      onClose();
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setLocalError(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  // Check if this is an edit (existing cell with _id) or create (new cell)
  const isEditing = cellData && cellData._id;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '1:00-2:00', '2:00-3:00', '3:00-4:00', '4:00-5:00'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {cellData ? 'Edit Timetable Cell' : 'Create Timetable Cell'}
        </h2>
        
        {(localError || error) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {localError || error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {/* Room */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="room"
                value={formData.room}
                onChange={handleChange}
                disabled={isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="e.g., Room 101"
                required
              />
              {isEditing && (
                <p className="text-xs text-gray-500 mt-1">Room cannot be changed</p>
              )}
            </div>
            
            {/* Day */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Day <span className="text-red-500">*</span>
              </label>
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                disabled={isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                required
              >
                <option value="">Select Day</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              {isEditing && (
                <p className="text-xs text-gray-500 mt-1">Day cannot be changed</p>
              )}
            </div>
            
            {/* Time Slot */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Slot <span className="text-red-500">*</span>
              </label>
              <select
                name="slot"
                value={formData.slot}
                onChange={handleChange}
                disabled={isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                required
              >
                <option value="">Select Time Slot</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
              {isEditing && (
                <p className="text-xs text-gray-500 mt-1">Time slot cannot be changed</p>
              )}
            </div>
            
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Computer Science"
                required
              />
            </div>
            
            {/* Subject Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Code
              </label>
              <input
                type="text"
                name="subjectCode"
                value={formData.subjectCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., CS101"
              />
            </div>
            
            {/* Subject Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Name
              </label>
              <input
                type="text"
                name="subjectName"
                value={formData.subjectName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Data Structures"
              />
            </div>
            
            {/* Branch */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch
              </label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., CSE"
              />
            </div>
            
            {/* Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section
              </label>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., A"
              />
            </div>
            
            {/* Teacher */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teacher
              </label>
              <input
                type="text"
                name="teacher"
                value={formData.teacher}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Dr. John Smith"
              />
            </div>
          </div>
          
          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
