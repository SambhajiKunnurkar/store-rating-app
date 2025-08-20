const express = require('express');
const {
  createStore,
  getStores,
  submitOrUpdateRating,
  getStoreOwnerDashboard
} = require('../controllers/storeController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router
  .route('/')
  .post(protect, authorize('System Administrator'), createStore)
  .get(protect, authorize('System Administrator', 'Normal User'), getStores);

router
  .route('/mydashboard')
  .get(protect, authorize('Store Owner'), getStoreOwnerDashboard);

router
  .route('/:storeId/rate')
  .post(protect, authorize('Normal User'), submitOrUpdateRating);


module.exports = router;