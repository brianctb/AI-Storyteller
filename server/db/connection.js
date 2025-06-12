const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
  } else {
    console.log("Connected to MySQL database.");
  }
});

const createTable = () => {
  const query = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            api_calls INT DEFAULT 20,
            is_admin BOOLEAN DEFAULT FALSE
        )
    `;
  db.query(query, (err) => {
    if (err) {
      console.error("Failed to create users table:", err.message);
    }
  });
};

module.exports = { db, createTable };
