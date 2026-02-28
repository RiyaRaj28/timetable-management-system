import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditTimetable from './EditTimetable';
import { AuthProvider } from '../context/AuthContext';
import { TimetableProvider } from '../context/TimetableContext';

// Mock the exportPdf utility
vi.mock('../utils/exportPdf', () => ({
  exportPdf: vi.fn(() => Promise.resolve())
}));

// Mock axios
vi.mock('../api/axios', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} }))
  }
}));

const renderWithProviders = (component) => {
  return render(
    <AuthProvider>
      <TimetableProvider>
        {component}
      </TimetableProvider>
    </AuthProvider>
  );
};

describe('EditTimetable Page Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all required components', async () => {
    renderWithProviders(<EditTimetable />);
    
    // Check for page title
    expect(screen.getByText('Edit Timetable')).toBeInTheDocument();
    
    // Check for PDF export button
    expect(screen.getByText('Export PDF')).toBeInTheDocument();
    
    // Check for room selector label
    await waitFor(() => {
      expect(screen.getByText('Filter by Room')).toBeInTheDocument();
    });
  });

  it('renders Excel upload component for Institute Admin', async () => {
    renderWithProviders(<EditTimetable />);
    
    // Excel upload should be visible for Institute Admin (default role)
    await waitFor(() => {
      expect(screen.getByText('Bulk Upload Department Allocation')).toBeInTheDocument();
    });
  });

  it('renders TimetableGrid component', async () => {
    renderWithProviders(<EditTimetable />);
    
    // Wait for timetable grid to load
    await waitFor(() => {
      // Grid should render with time slots
      expect(screen.getByText('Time Slot')).toBeInTheDocument();
    });
  });

  it('opens modal when cell is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EditTimetable />);
    
    // Wait for grid to load
    await waitFor(() => {
      expect(screen.getByText('Time Slot')).toBeInTheDocument();
    });
    
    // Find and click an "Add" button (empty cell)
    const addButtons = screen.getAllByText('+ Add');
    if (addButtons.length > 0) {
      await user.click(addButtons[0]);
      
      // Modal should open - check for modal form elements instead
      await waitFor(() => {
        expect(screen.getByText(/Create Timetable Cell|Edit Timetable Cell/)).toBeInTheDocument();
      }, { timeout: 2000 });
    }
  });

  it('handles PDF export button click', async () => {
    const user = userEvent.setup();
    const { exportPdf } = await import('../utils/exportPdf');
    
    renderWithProviders(<EditTimetable />);
    
    const exportButton = screen.getByText('Export PDF');
    await user.click(exportButton);
    
    // exportPdf should be called
    await waitFor(() => {
      expect(exportPdf).toHaveBeenCalled();
    });
  });
});
