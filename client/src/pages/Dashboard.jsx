import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalCells: 0,
    totalRooms: 0,
    totalDepartments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
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
        
        // Fetch timetable cells and rooms
        const [timetableResponse, roomsResponse] = await Promise.all([
          axios.get('/timetables', { headers }),
          axios.get('/rooms')
        ]);
        
        const timetableCells = timetableResponse.data;
        const rooms = roomsResponse.data;
        
        // Calculate statistics
        const uniqueDepartments = new Set(
          timetableCells
            .filter(cell => cell.department)
            .map(cell => cell.department)
        );
        
        setStats({
          totalCells: timetableCells.length,
          totalRooms: rooms.length,
          totalDepartments: uniqueDepartments.size
        });
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch statistics';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatistics();
  }, [user]);

  const handleNavigateToEditor = () => {
    navigate('/edit-timetable');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
        
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading statistics...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-gray-600 text-sm font-medium mb-2">Total Cells</h2>
                <p className="text-4xl font-bold text-blue-600">{stats.totalCells}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-gray-600 text-sm font-medium mb-2">Total Rooms</h2>
                <p className="text-4xl font-bold text-green-600">{stats.totalRooms}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-gray-600 text-sm font-medium mb-2">Total Departments</h2>
                <p className="text-4xl font-bold text-purple-600">{stats.totalDepartments}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <button
                onClick={handleNavigateToEditor}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Edit Timetable
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
