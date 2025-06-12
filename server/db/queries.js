// db/queries.js
const { db } = require("./connection");

// Function to register a user
const registerUser = (username, email, password, callback) => {
  const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
  db.query(query, [username, email, password], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

// Function to find a user by email
const findUserByEmail = (email, callback) => {
  const query = `SELECT * FROM users WHERE email = ?`;
  db.query(query, [email], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

const findUserById = (id, callback) => {
  const query = `SELECT * FROM users WHERE id = ?`;
  db.query(query, [id], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
}

// Function to get all users (admin)
const fetchAllUsers = (callback) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

const deleteUser = (id, callback) => {
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

const updateUser = (id, username, callback) => {
  const query = "UPDATE users SET username = ? WHERE id = ?";
  db.query(query, [username, id], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

const decrementApiCalls = (id, callback) => {
  const query =
    "UPDATE users SET api_calls = GREATEST(0, api_calls - 1) WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

const incrementCountInDB = (route, method, callback) => {
  const checkQuery = `SELECT * FROM resource WHERE endpoint = ? AND method = ?`;

  db.query(checkQuery, [route, method], (err, results) => {
    if (err) return callback(err, null);
    if (results.length > 0) {
      const updateQuery = `UPDATE resource SET requests = requests + 1 WHERE endpoint = ? AND method = ?`;
      db.query(updateQuery, [route, method], (updateErr, updateResults) => {
        if (updateErr) return callback(updateErr, null);
        callback(null, updateResults);
      });
    } else {
      addNewResource(route, method, (insertErr, insertResults) => {
        if (insertErr) return callback(insertErr, null);
        callback(null, insertResults);
      });
    }
  });
};

const addNewResource = (route, method, callback) => {
  const query = `INSERT INTO resource (endpoint, method, requests) VALUES (?, ?, 1)`;
  db.query(query, [route, method], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

const getAllResources = (callback) => {
  const query = "SELECT * FROM resource";
  db.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

module.exports = {
  registerUser,
  findUserByEmail,
  findUserById,
  fetchAllUsers,
  deleteUser,
  updateUser,
  decrementApiCalls,
  incrementCountInDB,
  getAllResources,
};
