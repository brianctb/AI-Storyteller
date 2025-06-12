/* ChatGPT-4o-mini (https: //chat.openai.com/) was used to code solutions presented in this assignment */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const hashPassword = (password) => bcrypt.hash(password, 10);

const verifyPassword = (password, hash) => bcrypt.compare(password, hash);

const generateToken = (user) =>
  jwt.sign({ id: user.id, username: user.username, isAdmin: user.is_admin, apiCalls: user.api_calls }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

module.exports = { hashPassword, verifyPassword, generateToken };
