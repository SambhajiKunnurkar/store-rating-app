
const express = require('express');
const { createUser, getUsers, getAdminDashboard } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();


router.use(protect);
router.use(authorize('System Administrator'));

router.route('/').post(createUser).get(getUsers);
router.route('/dashboard').get(getAdminDashboard);

module.exports = router;