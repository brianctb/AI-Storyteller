const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const aiRoutes = require('./ai');

// All routes
router.use('/', authRoutes);
router.use('/', aiRoutes);

module.exports = router;
