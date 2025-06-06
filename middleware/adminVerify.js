const jwt = require("jsonwebtoken");

const adminVerify = (req, res, next) => {
  const token = req.cookies["admintoken"]; // Check if token is present in cookies

  if (!token) {
    req.admin = null;

    return res.redirect("/admin/adminlogin"); // No token, proceed as unauthenticated
  }

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT); // Verify token
    req.admin = decoded; // Attach decoded user data to req.user
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    req.admin = null;
    return res.redirect("/admin/adminlogin");
  }
};

module.exports = adminVerify;
