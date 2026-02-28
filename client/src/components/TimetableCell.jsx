import React from 'react';

const TimetableCell = ({ data, onClick }) => {
  return (
    <div
      className="min-h-[80px] p-2 cursor-pointer hover:bg-blue-50 rounded transition-colors bg-white"
      onClick={onClick}
    >
      <div className="space-y-1">
        {/* Subject Information */}
        {data.subjectName && (
          <div className="font-semibold text-sm text-gray-800">
            {data.subjectName}
          </div>
        )}
        {data.subjectCode && (
          <div className="text-xs text-gray-600">
            {data.subjectCode}
          </div>
        )}
        
        {/* Instructor/Teacher */}
        {data.teacher && (
          <div className="text-xs text-gray-700">
            <span className="font-medium">Instructor:</span> {data.teacher}
          </div>
        )}
        
        {/* Department */}
        {data.department && (
          <div className="text-xs text-blue-600 font-medium">
            {data.department}
          </div>
        )}
        
        {/* Branch and Section */}
        {(data.branch || data.section) && (
          <div className="text-xs text-gray-500">
            {data.branch && <span>{data.branch}</span>}
            {data.branch && data.section && <span> - </span>}
            {data.section && <span>{data.section}</span>}
          </div>
        )}
        
        {/* Room (if needed for display) */}
        {data.room && (
          <div className="text-xs text-gray-500">
            Room: {data.room}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetableCell;
