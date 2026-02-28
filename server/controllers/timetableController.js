const Timetable = require('../models/Timetable');
const excelParser = require('../utils/excelParser');

exports.getAll = async (req, res) => {
  try {
    // Extract role, department, and room filter from headers/query
    const role = req.headers.role;
    const department = req.headers.department;
    const roomFilter = req.query.room;

    // Build query filter
    const filter = {};

    // Apply role-based filtering
    if (role === 'DEPARTMENT_ADMIN' && department) {
      // Department Admin: only see their department's cells
      filter.department = department;
    }
    // Institute Admin: no department filter (sees all cells)

    // Apply room filtering if provided
    if (roomFilter) {
      filter.room = roomFilter;
    }

    const data = await Timetable.find(filter);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createOrUpdate = async (req, res) => {
  try {
    const {
      room,
      day,
      slot,
      department,
      subjectCode,
      subjectName,
      branch,
      section,
      teacher
    } = req.body;

    // Validate required fields with descriptive error messages
    const missingFields = [];
    
    if (!room || room.trim() === '') {
      missingFields.push('room');
    }
    if (!day || day.trim() === '') {
      missingFields.push('day');
    }
    if (!slot || slot.trim() === '') {
      missingFields.push('timeSlot');
    }

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Validation failed: Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    let entry = await Timetable.findOne({ room, day, slot });

    if (entry) {
      Object.assign(entry, {
        department,
        subjectCode,
        subjectName,
        branch,
        section,
        teacher
      });

      await entry.save();
      return res.json(entry);
    }

    entry = await Timetable.create({
      room,
      day,
      slot,
      department,
      subjectCode,
      subjectName,
      branch,
      section,
      teacher
    });

    res.status(201).json(entry);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Bulk upload timetable entries from Excel file
 * Updates multiple timetable cells with department assignments
 */
exports.bulkUpload = async (req, res) => {
  try {
    const Room = require('../models/Room');
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        message: 'No file uploaded. Please upload an Excel file.' 
      });
    }

    // Parse the Excel file
    const parseResult = excelParser.parse(req.file.buffer);

    // If parsing failed, return errors
    if (!parseResult.success) {
      return res.status(400).json({
        message: 'Excel file validation failed',
        errors: parseResult.errors
      });
    }

    // Collect unique room names from Excel data
    const uniqueRooms = [...new Set(parseResult.data.map(row => row.room))];
    
    // Auto-create rooms that don't exist
    for (const roomName of uniqueRooms) {
      const existingRoom = await Room.findOne({ roomName: roomName });
      if (!existingRoom) {
        await Room.create({ roomName: roomName });
      }
    }

    // Process each valid row and update timetable cells
    const results = {
      successful: [],
      failed: []
    };

    for (const rowData of parseResult.data) {
      try {
        // Find existing entry or create new one
        let entry = await Timetable.findOne({
          room: rowData.room,
          day: rowData.day,
          slot: rowData.slot
        });

        if (entry) {
          // Update existing entry
          Object.assign(entry, {
            department: rowData.department,
            subjectCode: rowData.subjectCode,
            subjectName: rowData.subjectName,
            branch: rowData.branch,
            section: rowData.section,
            teacher: rowData.teacher
          });
          await entry.save();
        } else {
          // Create new entry
          entry = await Timetable.create({
            room: rowData.room,
            day: rowData.day,
            slot: rowData.slot,
            department: rowData.department,
            subjectCode: rowData.subjectCode,
            subjectName: rowData.subjectName,
            branch: rowData.branch,
            section: rowData.section,
            teacher: rowData.teacher
          });
        }

        results.successful.push({
          room: rowData.room,
          day: rowData.day,
          slot: rowData.slot,
          department: rowData.department
        });

      } catch (error) {
        results.failed.push({
          room: rowData.room,
          day: rowData.day,
          slot: rowData.slot,
          error: error.message
        });
      }
    }

    // Return results
    const allSuccessful = results.failed.length === 0;
    
    res.status(allSuccessful ? 200 : 207).json({
      message: allSuccessful 
        ? `Successfully updated ${results.successful.length} timetable entries`
        : `Partially completed: ${results.successful.length} successful, ${results.failed.length} failed`,
      successful: results.successful,
      failed: results.failed.length > 0 ? results.failed : undefined
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Server error during bulk upload',
      error: error.message 
    });
  }
};
