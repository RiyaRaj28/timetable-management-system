const Timetable = require("../models/Timetable");

const checkDepartmentAccess = async (req, res, next) => {
const role = req.headers.role || req.body.role;
const department = req.headers.department || req.body.department;

  if (role === "INSTITUTE_ADMIN") return next();

  const timetable = await Timetable.findById(req.params.id);

  if (!timetable) {
    return res.status(404).json({ msg: "Timetable entry not found" });
  }

  if (timetable.department !== department) {
    return res.status(403).json({
      msg: "You can only edit your department slots",
    });
  }

  next();
};

module.exports = checkDepartmentAccess;