import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RoomSelector from './RoomSelector';
import { TimetableContext } from '../context/TimetableContext';
import axios from '../api/axios';

// Mock axios
vi.mock('../api/axios');

describe('RoomSelector', () => {
  const mockSetSelectedRoom = vi.fn();
  const mockFetchTimetables = vi.fn();
  
  const mockContextValue = {
    selectedRoom: null,
    setSelectedRoom: mockSetSelectedRoom,
    fetchTimetables: mockFetchTimetables,
  };

  const mockRooms = [
    { _id: '1', roomName: 'Room 101' },
    { _id: '2', roomName: 'Room 102' },
    { _id: '3', roomName: 'Lab A' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithContext = (contextValue = mockContextValue) => {
    return render(
      <TimetableContext.Provider value={contextValue}>
        <RoomSelector />
      </TimetableContext.Provider>
    );
  };

  it('fetches and displays available rooms on mount', async () => {
    axios.get.mockResolvedValueOnce({ data: mockRooms });

    renderWithContext();

    // Wait for rooms to load
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/rooms');
    });

    // Check that all rooms are displayed
    await waitFor(() => {
      expect(screen.getByText('Room 101')).toBeInTheDocument();
      expect(screen.getByText('Room 102')).toBeInTheDocument();
      expect(screen.getByText('Lab A')).toBeInTheDocument();
    });
  });

  it('displays "All Rooms" option', async () => {
    axios.get.mockResolvedValueOnce({ data: mockRooms });

    renderWithContext();

    await waitFor(() => {
      expect(screen.getByText('All Rooms')).toBeInTheDocument();
    });
  });

  it('updates TimetableContext when room is selected', async () => {
    axios.get.mockResolvedValueOnce({ data: mockRooms });
    mockFetchTimetables.mockResolvedValueOnce([]);

    renderWithContext();

    // Wait for rooms to load
    await waitFor(() => {
      expect(screen.getByText('Room 101')).toBeInTheDocument();
    });

    // Select a room
    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, 'Room 101');

    // Verify context was updated
    expect(mockSetSelectedRoom).toHaveBeenCalledWith('Room 101');
    expect(mockFetchTimetables).toHaveBeenCalledWith('Room 101');
  });

  it('clears filter when "All Rooms" is selected', async () => {
    axios.get.mockResolvedValueOnce({ data: mockRooms });
    mockFetchTimetables.mockResolvedValueOnce([]);

    const contextWithRoom = {
      ...mockContextValue,
      selectedRoom: 'Room 101',
    };

    renderWithContext(contextWithRoom);

    // Wait for rooms to load
    await waitFor(() => {
      expect(screen.getByText('Room 101')).toBeInTheDocument();
    });

    // Select "All Rooms"
    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, '');

    // Verify filter was cleared
    expect(mockSetSelectedRoom).toHaveBeenCalledWith(null);
    expect(mockFetchTimetables).toHaveBeenCalledWith(null);
  });

  it('displays error message when room fetch fails', async () => {
    const errorMessage = 'Failed to fetch rooms';
    axios.get.mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });

    renderWithContext();

    await waitFor(() => {
      expect(screen.getByText(`Error loading rooms: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  it('displays loading state while fetching rooms', () => {
    axios.get.mockImplementationOnce(() => new Promise(() => {})); // Never resolves

    renderWithContext();

    expect(screen.getByText('Loading rooms...')).toBeInTheDocument();
  });

  it('disables select while loading', () => {
    axios.get.mockImplementationOnce(() => new Promise(() => {})); // Never resolves

    renderWithContext();

    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });
});
