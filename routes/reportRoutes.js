const express = require('express');
const { protect, adminOnly } = require("../middlewares/authmiddleware");
const { exportTasksReports, exportUsersReports } = require('../controllers/reportController');

const router = express.Router();

router.get('/export/tasks', protect, adminOnly, exportTasksReports);
router.get('/export/users', protect, adminOnly, exportUsersReports);

module.exports = router;

