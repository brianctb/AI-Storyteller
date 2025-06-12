const express = require("express");
const router = express.Router();
const {
  registerUser,
  findUserByEmail,
  fetchAllUsers,
  deleteUser,
  updateUser,
  getAllResources,
  findUserById,
} = require("../db/queries");
const {
  authenticate,
  checkAdmin,
  incrementRequestCount,
} = require("../middleware/auth");
const {
  hashPassword,
  verifyPassword,
  generateToken,
} = require("../utils/helpers");
const { ROUTES } = require("./route");
require("dotenv").config();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with a hashed password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword123"
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully."
 *       500:
 *         description: Registration failed due to a server error.
 */
router.post(ROUTES.AUTH.REGISTER, incrementRequestCount, async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await hashPassword(password);

  registerUser(username, email, hashedPassword, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "User registration failed." });
    }
    res.status(201).json({ message: "User registered successfully." });
  });
});

// User Login
router.post(ROUTES.AUTH.LOGIN, incrementRequestCount, (req, res) => {
  const { email, password } = req.body;

  findUserByEmail(email, async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: "User not found." });
    }

    const user = results[0];
    const passwordMatch = await verifyPassword(password, user.password);

    if (!passwordMatch) {
      return res.status(403).json({ message: "Invalid credentials." });
    }

    // the user object is passed to the generateToken function
    // is_admin is added to the token payload to show that the user is an admin
    const token = generateToken(user);

    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.json({
      api_calls: user.api_calls,
      isAdmin: user.is_admin,
      username: user.username,
    });
  });
});

// User Update (Authenticated Route)
router.put(
  `${ROUTES.USER.UPDATE}/:id`,
  authenticate,
  incrementRequestCount,
  async (req, res) => {
    const id = req.params.id; // Get ID from the URL parameter
    const { username } = req.body;

    updateUser(id, username, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "User update failed." });
      }

      // regenerate the cookie with the updated username
      findUserById(id, async (err, results) => {
        if (err || results.length === 0) {
          return res.status(400).json({ message: "User not found." });
        }
    
        const user = results[0];
        const token = generateToken(user);

        res.cookie("authToken", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          secure: true,
          sameSite: "none",
          path: "/",
        });

        res.status(200).json({ message: "User updated successfully." });
      });
    });
  }
);

// Admin-only Route Example
// passes through authenticate and checkAdmin middleware first
router.get(
  ROUTES.ADMIN.USERSDATA,
  authenticate,
  checkAdmin,
  incrementRequestCount,
  (req, res) => {
    fetchAllUsers((err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error fetching data.", error: err.message });
      }
      res.json({
        users: results,
        isAdmin: req.user.isAdmin,
      });
    });
  }
);

// Admin-only delete user route
router.delete(
  `${ROUTES.ADMIN.DELETEUSER}/:id`,
  authenticate,
  checkAdmin,
  incrementRequestCount,
  (req, res) => {
    const { id } = req.params;

    deleteUser(id, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error deleting user." });
      }
      res.json({ message: "User deleted successfully." });
    });
  }
);

// Check if the user is authenticated and return user data
router.get(
  ROUTES.AUTH.CHECKUSER,
  authenticate,
  incrementRequestCount,
  (req, res) => {
    if (req.user) {
      return res.json({
        isAdmin: req.user.isAdmin,
        apiCalls: req.user.apiCalls,
        id: req.user.id,
        username: req.user.username
      });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
);

// Get updated users api calls
router.get(
  ROUTES.USER.GETAPICALLS,
  authenticate,
  incrementRequestCount,
  (req, res) => {
    if (req.user) {
      const userId = req.user.id;
      findUserById(userId, (err, results) => {
        if (err || results.length === 0) {
          return res.status(400).json({ message: "User not found." });
        }
        res.json({ apiCalls: results[0].api_calls });
      });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
);

router.get(
  ROUTES.ADMIN.GETRESOURCE,
  authenticate,
  checkAdmin,
  incrementRequestCount,
  (req, res) => {
    getAllResources((err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching resources." });
      }
      res.json({ resources: results });
    });
  }
);

module.exports = router;
