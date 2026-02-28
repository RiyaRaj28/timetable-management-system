import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!selectedRole) {
      alert('Please select a role');
      return;
    }
    
    if (selectedRole === ROLES.DEPARTMENT_ADMIN && !selectedDepartment) {
      alert('Please select a department for Department Admin');
      return;
    }
    
    // Set user data
    const userData = {
      role: selectedRole,
      department: selectedRole === ROLES.DEPARTMENT_ADMIN ? selectedDepartment : null
    };
    
    login(userData);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Timetable Management</h1>
          <p className="text-gray-600">Select your role to continue</p>
        </div>
        
        <form onSubmit={handleLogin}>
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition">
                <input
                  type="radio"
                  name="role"
                  value={ROLES.INSTITUTE_ADMIN}
                  checked={selectedRole === ROLES.INSTITUTE_ADMIN}
                  onChange={(e) => {
                    setSelectedRole(e.target.value);
                    setSelectedDepartment('');
                  }}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="ml-3">
                  <div className="font-semibold text-gray-800">Institute Admin</div>
                  <div className="text-sm text-gray-500">Full access to all departments</div>
                </div>
              </label>
              
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition">
                <input
                  type="radio"
                  name="role"
                  value={ROLES.DEPARTMENT_ADMIN}
                  checked={selectedRole === ROLES.DEPARTMENT_ADMIN}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="ml-3">
                  <div className="font-semibold text-gray-800">Department Admin</div>
                  <div className="text-sm text-gray-500">Access to specific department only</div>
                </div>
              </label>
            </div>
          </div>
          
          {/* Department Selection (only for Department Admin) */}
          {selectedRole === ROLES.DEPARTMENT_ADMIN && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Department <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a department...</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Information Technology">Information Technology</option>
                <option value="ECE">ECE</option>
                <option value="MeC">MeC</option>
              </select>
            </div>
          )}
          
          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Demo login - No password required</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
