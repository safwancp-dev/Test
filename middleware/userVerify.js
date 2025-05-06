const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.cookies?.token; // Check if token is present in cookies

  if (!token) {
    req.user = null;
    return next(); // No token, proceed as unauthenticated
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Attach decoded user data to req.user
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    req.user = null; // Treat as unauthenticated
    next();
  }
};

module.exports = authenticateUser;