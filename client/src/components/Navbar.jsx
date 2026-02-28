import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isInstituteAdmin, isDepartmentAdmin } = useAuth();

  const getRoleDisplay = () => {
    if (isInstituteAdmin()) {
      return 'Institute Admin';
    } else if (isDepartmentAdmin()) {
      return 'Department Admin';
    }
    return 'User';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold hover:text-blue-200 transition">
              Timetable Management
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex space-x-4 ml-8">
              <Link 
                to="/" 
                className="px-3 py-2 rounded hover:bg-blue-700 transition"
              >
                Dashboard
              </Link>
              <Link 
                to="/edit-timetable" 
                className="px-3 py-2 rounded hover:bg-blue-700 transition"
              >
                Edit Timetable
              </Link>
            </div>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-semibold">{getRoleDisplay()}</div>
              {user?.department && (
                <div className="text-xs text-blue-200">{user.department}</div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
