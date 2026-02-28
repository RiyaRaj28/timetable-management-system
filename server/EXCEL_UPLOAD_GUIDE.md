# Excel Upload Guide for Bulk Department Allocation

## Overview

The Excel upload feature allows Institute Admins to bulk upload timetable entries by uploading an Excel file. The system will parse the file, validate the data, and update multiple timetable cells with department assignments.

## Excel File Format

### Required Columns

The Excel file must contain the following columns (case-sensitive):

| Column Name | Type   | Required | Description                                    |
|-------------|--------|----------|------------------------------------------------|
| room        | String | Yes      | Room identifier (e.g., "Room 101")            |
| day         | String | Yes      | Day of the week (Monday-Sunday)               |
| slot        | String | Yes      | Time slot (e.g., "9:00-10:00")                |
| department  | String | Yes      | Department name (e.g., "Computer Science")    |

### Optional Columns

| Column Name  | Type   | Required | Description                                    |
|--------------|--------|----------|------------------------------------------------|
| subjectCode  | String | No       | Subject code (e.g., "CS101")                  |
| subjectName  | String | No       | Subject name (e.g., "Data Structures")        |
| branch       | String | No       | Branch/program (e.g., "CSE")                  |
| section      | String | No       | Section identifier (e.g., "A")                |
| teacher      | String | No       | Teacher name (e.g., "Dr. Smith")              |

### Valid Day Values

The `day` column must contain one of the following values:
- Monday
- Tuesday
- Wednesday
- Thursday
- Friday
- Saturday
- Sunday

## Example Excel File

| room     | day       | slot        | department         | subjectCode | subjectName      | teacher    |
|----------|-----------|-------------|--------------------|-------------|------------------|------------|
| Room 101 | Monday    | 9:00-10:00  | Computer Science   | CS101       | Data Structures  | Dr. Smith  |
| Room 102 | Tuesday   | 10:00-11:00 | Mathematics        | MATH201     | Calculus         | Prof. Lee  |
| Room 103 | Wednesday | 11:00-12:00 | Physics            | PHY301      | Quantum Mechanics| Dr. Brown  |

## API Endpoint

### POST /api/timetables/bulk-upload

**Authorization:** Institute Admin only

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Headers:
  - `role: INSTITUTE_ADMIN`
- Body:
  - `file`: Excel file (.xls or .xlsx)

**Response (Success):**
```json
{
  "message": "Successfully updated 3 timetable entries",
  "successful": [
    {
      "room": "Room 101",
      "day": "Monday",
      "slot": "9:00-10:00",
      "department": "Computer Science"
    }
  ]
}
```

**Response (Validation Errors):**
```json
{
  "message": "Excel file validation failed",
  "errors": [
    {
      "row": 3,
      "errors": [
        "Missing or empty 'room'"
      ]
    },
    {
      "row": 4,
      "errors": [
        "Invalid day 'InvalidDay'. Must be one of: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday"
      ]
    }
  ]
}
```

**Response (Partial Success):**
```json
{
  "message": "Partially completed: 2 successful, 1 failed",
  "successful": [
    {
      "room": "Room 101",
      "day": "Monday",
      "slot": "9:00-10:00",
      "department": "Computer Science"
    }
  ],
  "failed": [
    {
      "room": "Room 102",
      "day": "Tuesday",
      "slot": "10:00-11:00",
      "error": "Database error message"
    }
  ]
}
```

## Validation Rules

1. **Required Fields:** All required columns (room, day, slot, department) must be present and non-empty
2. **Day Format:** The day must be a valid weekday name (Monday-Sunday)
3. **File Size:** Maximum file size is 5MB
4. **File Type:** Only Excel files (.xls, .xlsx) are accepted
5. **Empty Sheet:** The Excel sheet must contain at least one data row

## Behavior

- **Update Existing Entries:** If a timetable entry already exists for the same room, day, and slot, it will be updated with the new department and other information
- **Create New Entries:** If no entry exists for the room, day, and slot combination, a new entry will be created
- **Row-Specific Errors:** If validation fails for specific rows, the system will report which rows have errors and what the errors are
- **Partial Success:** Valid rows will be processed even if some rows have errors

## Testing

Test Excel files are available in the `test-files/` directory:
- `valid-timetable.xlsx`: Contains only valid data
- `invalid-timetable.xlsx`: Contains validation errors
- `mixed-timetable.xlsx`: Contains both valid and invalid data

To generate test files, run:
```bash
node test-bulk-upload.js
```

## Example cURL Command

```bash
curl -X POST http://localhost:5000/api/timetables/bulk-upload \
  -H "role: INSTITUTE_ADMIN" \
  -F "file=@test-files/valid-timetable.xlsx"
```
