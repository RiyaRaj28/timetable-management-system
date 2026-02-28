import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExcelUpload from './ExcelUpload';
import { AuthContext } from '../context/AuthContext';
import { TimetableContext } from '../context/TimetableContext';
import axios from '../api/axios';

vi.mock('../api/axios');

describe('ExcelUpload Component', () => {
  const mockFetchTimetables = vi.fn();
  
  const renderWithContext = (isInstituteAdmin = true) => {
    const authValue = {
      isInstituteAdmin: () => isInstituteAdmin,
      user: {
        role: isInstituteAdmin ? 'INSTITUTE_ADMIN' : 'DEPARTMENT_ADMIN',
        department: isInstituteAdmin ? null : 'Computer Science'
      }
    };

    const timetableValue = {
      fetchTimetables: mockFetchTimetables,
      selectedRoom: null
    };

    return render(
      <AuthContext.Provider value={authValue}>
        <TimetableContext.Provider value={timetableValue}>
          <ExcelUpload />
        </TimetableContext.Provider>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render upload component for Institute Admin', () => {
    renderWithContext(true);
    
    expect(screen.getByText('Bulk Upload Department Allocation')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
  });

  it('should not render for Department Admin', () => {
    const { container } = renderWithContext(false);
    
    expect(container.firstChild).toBeNull();
  });

  it('should enable upload button when file is selected', () => {
    renderWithContext(true);
    
    const fileInput = document.querySelector('input[type="file"]');
    const uploadButton = screen.getByRole('button', { name: /upload/i });
    
    expect(uploadButton).toBeDisabled();
    
    const file = new File(['test'], 'test.xlsx', { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(uploadButton).not.toBeDisabled();
  });

  it('should show error message for invalid file type', () => {
    renderWithContext(true);
    
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(screen.getByText(/please select a valid excel file/i)).toBeInTheDocument();
  });

  it('should upload file and show success message', async () => {
    axios.post.mockResolvedValue({
      data: { message: 'Upload successful' }
    });

    renderWithContext(true);
    
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['test'], 'test.xlsx', { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    const uploadButton = screen.getByRole('button', { name: /upload/i });
    fireEvent.click(uploadButton);
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        '/timetables/bulk-upload',
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'multipart/form-data',
            role: 'INSTITUTE_ADMIN'
          })
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/upload successful/i)).toBeInTheDocument();
    });

    expect(mockFetchTimetables).toHaveBeenCalled();
  });

  it('should show error message on upload failure', async () => {
    const error = new Error('Failed to upload Excel file');
    error.response = {
      status: 500,
      data: { message: 'Upload failed' }
    };
    axios.post.mockRejectedValue(error);

    renderWithContext(true);
    
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['test'], 'test.xlsx', { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    const uploadButton = screen.getByRole('button', { name: /upload/i });
    fireEvent.click(uploadButton);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to upload excel file/i)).toBeInTheDocument();
    });

    expect(mockFetchTimetables).not.toHaveBeenCalled();
  });

  it('should refresh timetable after successful upload', async () => {
    axios.post.mockResolvedValue({
      data: { message: 'Upload successful' }
    });

    renderWithContext(true);
    
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['test'], 'test.xlsx', { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    const uploadButton = screen.getByRole('button', { name: /upload/i });
    fireEvent.click(uploadButton);
    
    await waitFor(() => {
      expect(mockFetchTimetables).toHaveBeenCalledWith(null);
    });
  });
});
