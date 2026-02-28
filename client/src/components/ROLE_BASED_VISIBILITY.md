# Role-Based Visibility Implementation

## Overview
Task 4.3 implements role-based visibility in the TimetableGrid component, ensuring that users only see timetable cells they are authorized to view based on their role and department.

## Implementation Details

### Requirements Addressed
- **Requirement 2.3**: Department Admin views only their department's cells in the grid
- **Requirement 2.4**: Institute Admin views all timetable cells in the grid
- **Requirement 7.2**: Grid displays only department cells for Department Admin
- **Requirement 7.3**: Grid displays all cells for Institute Admin

### Changes Made

#### TimetableGrid Component (`client/src/components/TimetableGrid.jsx`)

1. **Added AuthContext Integration**
   - Imported `AuthContext` to access role checking utilities
   - Uses `isInstituteAdmin()`, `isDepartmentAdmin()`, and `getUserDepartment()` functions

2. **Implemented Frontend Filtering**
   - Added `filterCellsByRole()` function that provides additional frontend validation
   - Institute Admin: Returns all cells (no filtering)
   - Department Admin: Filters cells to show only those matching user's department
   - Department Admin with no department: Returns empty array

3. **Added Visual Indicators**
   - Blue indicator for Department Admin showing which department is being viewed
   - Green indicator for Institute Admin showing all departments are visible
   - Uses Tailwind CSS for styling with appropriate icons

### Architecture

```
Backend Filtering (Primary)
├── TimetableContext sends role/department headers
├── Backend filters data in getAll() controller
└── Returns filtered dataset to frontend

Frontend Filtering (Secondary Validation)
├── TimetableGrid receives filtered data
├── filterCellsByRole() provides additional validation
└── Displays only authorized cells
```

### Data Flow

1. **User Authentication**
   - AuthContext provides user role and department
   - Hardcoded for minimal implementation (can be replaced with real auth)

2. **Data Fetching**
   - TimetableContext.fetchTimetables() sends role/department in headers
   - Backend applies role-based filtering
   - Returns filtered dataset

3. **Frontend Display**
   - TimetableGrid receives filtered data
   - Applies additional frontend filtering for validation
   - Displays visual indicator based on role
   - Renders only authorized cells in grid

### Testing

Backend filtering is tested in `server/test-timetable-filtering.js`:
- ✓ Institute Admin sees all cells
- ✓ Department Admin sees only their department cells
- ✓ Room filtering works correctly
- ✓ Combined filtering (role + room) works correctly

### Manual Testing Instructions

1. **Test Institute Admin View**
   ```javascript
   // In client/src/context/AuthContext.jsx
   const [user, setUser] = useState({
     role: ROLES.INSTITUTE_ADMIN,
     department: null
   });
   ```
   - Expected: Green indicator, all cells visible

2. **Test Department Admin View**
   ```javascript
   // In client/src/context/AuthContext.jsx
   const [user, setUser] = useState({
     role: ROLES.DEPARTMENT_ADMIN,
     department: 'Computer Science'
   });
   ```
   - Expected: Blue indicator, only Computer Science cells visible

3. **Test Department Admin with No Department**
   ```javascript
   const [user, setUser] = useState({
     role: ROLES.DEPARTMENT_ADMIN,
     department: null
   });
   ```
   - Expected: Blue indicator with null, no cells visible

### Security Considerations

- **Defense in Depth**: Both backend and frontend filtering provide layered security
- **Backend is Primary**: Backend filtering is the authoritative security layer
- **Frontend is Secondary**: Frontend filtering provides UX and additional validation
- **Never trust frontend alone**: Backend must always validate and filter data

### Future Enhancements

- Add unit tests for filterCellsByRole() function
- Add integration tests for role-based visibility
- Implement real authentication system
- Add role-based edit restrictions (Department Admin can only edit their cells)
- Add audit logging for role-based access
