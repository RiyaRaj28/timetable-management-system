import { createContext, useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from './AuthContext';
import ErrorNotification from '../components/ErrorNotification';

export const TimetableContext = createContext();

export const TimetableProvider = ({ children }) => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { user } = useContext(AuthContext);

  // Fetch timetables with role and room filtering
  const fetchTimetables = async (roomFilter = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {};
      const headers = {};
      
      // Add room filter if provided
      if (roomFilter) {
        params.room = roomFilter;
      }
      
      // Add role and department in headers for authorization
      if (user) {
        headers.role = user.role;
        if (user.department) {
          headers.department = user.department;
        }
      }
      
      const response = await axios.get('/timetables', { params, headers });
      setTimetable(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch timetables';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Create a new timetable cell
  const createCell = async (cellData) => {
    setLoading(true);
    setError(null);
    
    try {
      const headers = {};
      
      // Add role and department in headers for authorization
      if (user) {
        headers.role = user.role;
        if (user.department) {
          headers.department = user.department;
        }
      }
      
      const response = await axios.post('/timetables', cellData, { headers });
      
      // Refresh timetable after creation
      await fetchTimetables(selectedRoom);
      
      return response.data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to create timetable cell';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update an existing timetable cell
  const updateCell = async (cellId, cellData) => {
    setLoading(true);
    setError(null);
    
    try {
      const headers = {};
      
      // Add role and department in headers for authorization
      if (user) {
        headers.role = user.role;
        if (user.department) {
          headers.department = user.department;
        }
      }
      
      const response = await axios.put(`/timetables/${cellId}`, cellData, { headers });
      
      // Refresh timetable after update
      await fetchTimetables(selectedRoom);
      
      return response.data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update timetable cell';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete a timetable cell
  const deleteCell = async (cellId) => {
    setLoading(true);
    setError(null);
    
    try {
      const headers = {};
      
      // Add role and department in headers for authorization
      if (user) {
        headers.role = user.role;
        if (user.department) {
          headers.department = user.department;
        }
      }
      
      await axios.delete(`/timetables/${cellId}`, { headers });
      
      // Refresh timetable after deletion
      await fetchTimetables(selectedRoom);
      
      return true;
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete timetable cell';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    timetable,
    setTimetable,
    loading,
    error,
    setError,
    selectedRoom,
    setSelectedRoom,
    fetchTimetables,
    createCell,
    updateCell,
    deleteCell
  };

  return (
    <TimetableContext.Provider value={value}>
      {children}
      <ErrorNotification 
        message={error} 
        onClose={() => setError(null)} 
      />
    </TimetableContext.Provider>
  );
};
