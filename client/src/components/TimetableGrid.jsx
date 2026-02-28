import React, { useContext, useEffect, useState } from 'react';
import { TimetableContext } from '../context/TimetableContext';
import { AuthContext } from '../context/AuthContext';
import TimetableCell from './TimetableCell';

// Define days and time slots
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = [
  '9:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-13:00',
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00'
];

const TimetableGrid = ({ onCellClick }) => {
  const { timetable, loading, error, fetchTimetables, selectedRoom } = useContext(TimetableContext);
  const { isInstituteAdmin, isDepartmentAdmin, getUserDepartment } = useContext(AuthContext);

  useEffect(() => {
    // Fetch timetables when component mounts or when selected room changes
    fetchTimetables(selectedRoom);
  }, [selectedRoom]);

  // Helper function to filter displayed cells based on user role and department
  // Note: Backend already filters data, but this provides additional frontend validation
  const filterCellsByRole = (cells) => {
    // Institute Admin sees all cells (no filtering needed)
    if (isInstituteAdmin()) {
      return cells;
    }
    
    // Department Admin sees only their department's cells
    if (isDepartmentAdmin()) {
      const userDepartment = getUserDepartment();
      if (!userDepartment) {
        // If no department is set for Department Admin, show no cells
        return [];
      }
      // Filter cells to show only those matching the user's department
      return cells.filter(cell => cell.department === userDepartment);
    }
    
    // Default: return all cells (fallback)
    return cells;
  };

  // Apply role-based filtering to timetable data
  const filteredTimetable = filterCellsByRole(timetable);

  // Helper function to find a cell for a specific day and time slot
  const findCell = (day, slot) => {
    return filteredTimetable.find(cell => cell.day === day && cell.slot === slot);
  };

  // Handle click on a cell (existing or empty)
  const handleCellClick = (day, slot, existingCell = null) => {
    if (onCellClick) {
      onCellClick({ day, slot, cell: existingCell });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading timetable...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Role-based visibility indicator */}
      {isDepartmentAdmin() && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-blue-800">
              Showing timetable for <span className="font-semibold">{getUserDepartment()}</span> department only
            </span>
          </div>
        </div>
      )}
      
      {isInstituteAdmin() && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-green-800">
              Showing all departments (Institute Admin view)
            </span>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
              Time Slot
            </th>
            {DAYS.map(day => (
              <th key={day} className="border border-gray-300 px-4 py-2 text-center font-semibold">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_SLOTS.map(slot => (
            <tr key={slot}>
              <td className="border border-gray-300 px-4 py-2 bg-gray-50 font-medium">
                {slot}
              </td>
              {DAYS.map(day => {
                const cell = findCell(day, slot);
                return (
                  <td
                    key={`${day}-${slot}`}
                    className="border border-gray-300 p-2"
                  >
                    {cell ? (
                      <TimetableCell
                        data={cell}
                        onClick={() => handleCellClick(day, slot, cell)}
                      />
                    ) : (
                      <div
                        className="min-h-[80px] flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded transition-colors"
                        onClick={() => handleCellClick(day, slot, null)}
                      >
                        <span className="text-gray-400 text-sm">+ Add</span>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default TimetableGrid;
