import { useState, useRef } from 'react';
import TimetableGrid from '../components/TimetableGrid';
import EditModal from '../components/EditModal';
import RoomSelector from '../components/RoomSelector';
import ExcelUpload from '../components/ExcelUpload';
import AddRoomModal from '../components/AddRoomModal';
import { exportPdf } from '../utils/exportPdf';

const EditTimetable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [selectedCellData, setSelectedCellData] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [roomRefreshKey, setRoomRefreshKey] = useState(0);
  const timetableRef = useRef(null);

  // Handle cell click from TimetableGrid
  const handleCellClick = ({ day, slot, cell }) => {
    // Prepare cell data for modal
    // If cell exists, pass it for editing
    // If cell is null (empty slot), pass day and slot for creating new cell
    if (cell) {
      setSelectedCellData(cell);
    } else {
      // For new cells, pre-populate day and slot
      setSelectedCellData({ day, slot });
    }
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCellData(null);
  };

  // Handle PDF export
  const handleExportPdf = async () => {
    if (!timetableRef.current) {
      alert('Unable to export: Timetable not found');
      return;
    }

    try {
      setIsExporting(true);
      await exportPdf(timetableRef.current, 'timetable.pdf');
    } catch (error) {
      console.error('PDF export failed:', error);
      alert(error.message || 'Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle room added
  const handleRoomAdded = () => {
    // Trigger room selector refresh by changing key
    setRoomRefreshKey(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Timetable</h1>
        
        {/* PDF Export Button */}
        <button
          onClick={handleExportPdf}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          {isExporting ? 'Exporting...' : 'Export PDF'}
        </button>
      </div>
      
      {/* Room Selector */}
      <div className="mb-6 flex items-end gap-3">
        <div className="flex-1">
          <RoomSelector key={roomRefreshKey} />
        </div>
        <button
          onClick={() => setIsAddRoomModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Room
        </button>
      </div>
      
      {/* Excel Upload - Only visible for Institute Admin */}
      <ExcelUpload />
      
      {/* Timetable Grid with click handler - wrapped in ref container */}
      <div ref={timetableRef}>
        <TimetableGrid onCellClick={handleCellClick} />
      </div>
      
      {/* Edit Modal */}
      <EditModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        cellData={selectedCellData}
      />
      
      {/* Add Room Modal */}
      <AddRoomModal
        isOpen={isAddRoomModalOpen}
        onClose={() => setIsAddRoomModalOpen(false)}
        onRoomAdded={handleRoomAdded}
      />
    </div>
  );
};

export default EditTimetable;
