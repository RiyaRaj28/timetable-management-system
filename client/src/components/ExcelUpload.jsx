import { useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { TimetableContext } from '../context/TimetableContext';

const ExcelUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); // 'success' or 'error'
  
  const { isInstituteAdmin, user } = useContext(AuthContext);
  const { fetchTimetables, selectedRoom } = useContext(TimetableContext);

  // Only show component for Institute Admin
  if (!isInstituteAdmin()) {
    return null;
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        setFile(selectedFile);
        setMessage(null);
      } else {
        setFile(null);
        setMessage('Please select a valid Excel file (.xlsx or .xls)');
        setMessageType('error');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file to upload');
      setMessageType('error');
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const headers = {
        'Content-Type': 'multipart/form-data',
        role: user.role
      };

      if (user.department) {
        headers.department = user.department;
      }

      const response = await axios.post('/timetables/bulk-upload', formData, { headers });

      setMessage(response.data.message || 'Excel file uploaded successfully!');
      setMessageType('success');
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('excel-file-input');
      if (fileInput) {
        fileInput.value = '';
      }

      // Refresh timetable after successful upload
      await fetchTimetables(selectedRoom);
    } catch (err) {
      const errorMessage = err.message || 'Failed to upload Excel file';
      const errors = err.response?.data?.errors;
      
      if (errors && errors.length > 0) {
        setMessage(`${errorMessage}: ${errors.join(', ')}`);
      } else {
        setMessage(errorMessage);
      }
      setMessageType('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-semibold mb-3">Bulk Upload Department Allocation</h3>
      
      <div className="flex items-center gap-3 mb-3">
        <input
          id="excel-file-input"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
            disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap
            transition-colors duration-200"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {message && (
        <div
          className={`p-3 rounded-md text-sm ${
            messageType === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        Upload an Excel file (.xlsx or .xls) with columns: Room, Day, TimeSlot, Department
      </p>
    </div>
  );
};

export default ExcelUpload;
