import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { AuthProvider } from '../context/AuthContext';
import axios from '../api/axios';

// Mock axios
vi.mock('../api/axios');

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display loading state initially', () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    renderDashboard();
    
    expect(screen.getByText('Loading statistics...')).toBeInTheDocument();
  });

  it('should fetch and display statistics', async () => {
    const mockTimetables = [
      { _id: '1', department: 'Computer Science', room: 'Room 101' },
      { _id: '2', department: 'Mathematics', room: 'Room 102' },
      { _id: '3', department: 'Computer Science', room: 'Room 103' }
    ];
    
    const mockRooms = [
      { _id: '1', name: 'Room 101' },
      { _id: '2', name: 'Room 102' },
      { _id: '3', name: 'Room 103' }
    ];
    
    axios.get.mockImplementation((url) => {
      if (url === '/timetables') {
        return Promise.resolve({ data: mockTimetables });
      }
      if (url === '/rooms') {
        return Promise.resolve({ data: mockRooms });
      }
    });
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('Total Cells')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Total Rooms')).toBeInTheDocument();
    expect(screen.getByText('Total Departments')).toBeInTheDocument();
    
    // Check for the statistics values
    const cellsValue = screen.getAllByText('3');
    expect(cellsValue.length).toBeGreaterThan(0); // Total cells and rooms both show 3
    expect(screen.getByText('2')).toBeInTheDocument(); // Total departments (CS and Math)
  });

  it('should display error message when fetch fails', async () => {
    const error = new Error('Failed to fetch statistics');
    error.response = { 
      status: 500,
      data: { message: 'Failed to fetch data' } 
    };
    axios.get.mockRejectedValue(error);
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch statistics')).toBeInTheDocument();
    });
  });

  it('should navigate to edit timetable page when button is clicked', async () => {
    const mockTimetables = [];
    const mockRooms = [];
    
    axios.get.mockImplementation((url) => {
      if (url === '/timetables') {
        return Promise.resolve({ data: mockTimetables });
      }
      if (url === '/rooms') {
        return Promise.resolve({ data: mockRooms });
      }
    });
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('Edit Timetable')).toBeInTheDocument();
    });
    
    const editButton = screen.getByText('Edit Timetable');
    expect(editButton).toBeInTheDocument();
  });

  it('should calculate unique departments correctly', async () => {
    const mockTimetables = [
      { _id: '1', department: 'Computer Science' },
      { _id: '2', department: 'Computer Science' },
      { _id: '3', department: 'Mathematics' },
      { _id: '4', department: null }
    ];
    
    const mockRooms = [{ _id: '1', name: 'Room 101' }];
    
    axios.get.mockImplementation((url) => {
      if (url === '/timetables') {
        return Promise.resolve({ data: mockTimetables });
      }
      if (url === '/rooms') {
        return Promise.resolve({ data: mockRooms });
      }
    });
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('4')).toBeInTheDocument(); // Total cells
    });
    
    // Should show 2 unique departments (CS and Math, null is filtered out)
    const departmentStats = screen.getAllByText('2');
    expect(departmentStats.length).toBeGreaterThan(0);
  });
});
