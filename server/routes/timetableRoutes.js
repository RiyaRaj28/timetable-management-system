const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure multer for memory storage (file buffer)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only Excel files
    const allowedMimes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel files (.xls, .xlsx) are allowed.'));
    }
  }
});

const checkRole = require('../middleware/roleMiddleware');
const checkDepartmentAccess = require('../middleware/departmentMiddleware');
// const createOrUpdate = require('../controllers/timetableController');


const {
  getAll,
  createOrUpdate,
  delete: del,
  bulkUpload
} = require('../controllers/timetableController');

router.get('/', getAll);

router.post(
  '/',
  checkRole('INSTITUTE_ADMIN', 'DEPARTMENT_ADMIN'),
  createOrUpdate
);

router.delete(
  '/:id',
  checkRole('INSTITUTE_ADMIN'),
  del
);

router.put(
  '/:id',
  checkRole('INSTITUTE_ADMIN', 'DEPARTMENT_ADMIN'),
  checkDepartmentAccess,
  createOrUpdate
);

// Bulk upload endpoint (Institute Admin only)
router.post(
  '/bulk-upload',
  checkRole('INSTITUTE_ADMIN'),
  upload.single('file'),
  (err, req, res, next) => {
    // Handle multer errors
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  },
  bulkUpload
);

module.exports = router;