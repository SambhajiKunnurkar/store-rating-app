const express = require('express');
const { createUser, getUsers, getAdminDashboard, updateUserRole,deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.use(authorize('System Administrator'));

router.route('/').post(createUser).get(getUsers);
router.route('/dashboard').get(getAdminDashboard);
router.route('/:id')
    .put(updateUserRole) 
    .delete(deleteUser);
module.exports = router;