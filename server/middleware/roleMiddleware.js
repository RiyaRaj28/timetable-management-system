const checkRole = (...allowedRoles) => {
  return (req, res, next) => {

    const role = req.headers.role || req.body.role;

    if (!role) {
      return res.status(400).json({ msg: "Role is required" });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ msg: "Access denied" });
    }

    next();
  };
};

module.exports = checkRole;