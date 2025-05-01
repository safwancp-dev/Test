require("dotenv").config();
const jwt = require("jsonwebtoken");



const publicPaths = ["/home", "/shop", "/about", "/login", "/signup"];

async function userAuth(req, res, next) {
  const token = req.cookies.token;

  try {
    if (!token) {
        console.log('unotharized user')
      if (publicPaths.includes(req.path)) return next();
      return res.redirect("/login");
    }
    const verifyUser = jwt.verify(token, process.env.JWT_SECRET);
    // ✅ This sets req.user correctly as { id: userId }
    req.user = verifyUser.user;
    console.log("User from token:", req.user); // ✅ Debug output
    next();
   
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(500).send('server error',err)     
  }
}

module.exports = userAuth;