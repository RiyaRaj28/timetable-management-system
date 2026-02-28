const xlsx = require('xlsx');

/**
 * Parse Excel file for bulk department allocation
 * Expected columns: room, day, slot, department
 * @param {Buffer} buffer - Excel file buffer
 * @returns {Object} - { success: boolean, data: Array, errors: Array }
 */
exports.parse = (buffer) => {
  try {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    
    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return {
        success: false,
        data: [],
        errors: ['Excel file is empty or has no sheets']
      };
    }
    
    const sheet = workbook.Sheets[sheetName];
    
    // Convert sheet to JSON with header row
    const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: '' });
    
    if (jsonData.length === 0) {
      return {
        success: false,
        data: [],
        errors: ['Excel sheet is empty']
      };
    }
    
    const validData = [];
    const errors = [];
    const requiredFields = ['room', 'day', 'slot', 'department'];
    
    // Validate and process each row
    jsonData.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because Excel rows start at 1 and we have a header
      const rowErrors = [];
      
      // Check for required fields
      requiredFields.forEach(field => {
        const value = row[field];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          rowErrors.push(`Missing or empty '${field}'`);
        }
      });
      
      // Validate day format (should be one of the weekdays)
      const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      if (row.day && !validDays.includes(row.day.trim())) {
        rowErrors.push(`Invalid day '${row.day}'. Must be one of: ${validDays.join(', ')}`);
      }
      
      if (rowErrors.length > 0) {
        errors.push({
          row: rowNumber,
          errors: rowErrors
        });
      } else {
        // Add valid row to data
        validData.push({
          room: row.room.toString().trim(),
          day: row.day.toString().trim(),
          slot: row.slot.toString().trim(),
          department: row.department.toString().trim(),
          // Optional fields
          subjectCode: row.subjectCode ? row.subjectCode.toString().trim() : undefined,
          subjectName: row.subjectName ? row.subjectName.toString().trim() : undefined,
          branch: row.branch ? row.branch.toString().trim() : undefined,
          section: row.section ? row.section.toString().trim() : undefined,
          teacher: row.teacher ? row.teacher.toString().trim() : undefined
        });
      }
    });
    
    return {
      success: errors.length === 0,
      data: validData,
      errors: errors.length > 0 ? errors : undefined
    };
    
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [`Failed to parse Excel file: ${error.message}`]
    };
  }
};
