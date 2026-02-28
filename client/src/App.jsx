import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TimetableProvider } from './context/TimetableContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import EditTimetable from './pages/EditTimetable';
import PdfViewer from './pages/PdfViewer';
import Login from './pages/Login';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function AppContent() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-100">
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/edit-timetable" element={<ProtectedRoute><EditTimetable /></ProtectedRoute>} />
        <Route path="/pdf-viewer" element={<ProtectedRoute><PdfViewer /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <TimetableProvider>
            <AppContent />
          </TimetableProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
