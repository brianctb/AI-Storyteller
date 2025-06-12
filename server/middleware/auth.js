const jwt = require("jsonwebtoken");
require("dotenv").config();
const { BASE } = require("../routes/route");
const { incrementCountInDB } = require("../db/queries");

// These middle ware are autmatically passsed 3 arguments by express
// req, res, next

// Middleware to authenticate users
function authenticate(req, res, next) {
  // Extract token from cookies instead of headers
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}
// Middleware to check if the user is an admin
function checkAdmin(req, res, next) {
  if (req.user?.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admins only." });
  }
}

function incrementRequestCount(req, res, next) {
  const route = req.originalUrl;
  const method = req.method;

  incrementCountInDB(route, method, (err, results) => {
    if (err) {
      console.error("Error incrementing request count:", err);
      return res.status(500).json({ message: "Error tracking request count." });
    }
    next();
  });
}

module.exports = { authenticate, checkAdmin, incrementRequestCount };
