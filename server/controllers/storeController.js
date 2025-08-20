const Store = require('../models/Store');
const Rating = require('../models/Rating');
const mongoose = require('mongoose');

exports.createStore = async (req, res) => {
  try {
    const store = await Store.create(req.body);
    res.status(201).json({ success: true, data: store });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating store', error: error.message });
  }
};


exports.getStores = async (req, res) => {
    const { name, address } = req.query;
    let storeQuery = {};
    if (name) storeQuery.name = { $regex: name, $options: 'i' };
    if (address) storeQuery.address = { $regex: address, $options: 'i' };

    try {
        
        const stores = await Store.find(storeQuery).lean();

        const ratings = await Rating.find({});
        const userRatings = await Rating.find({ user: req.user.id });

        const storesWithRatings = stores.map(store => {
            const storeRatings = ratings.filter(r => r.store.toString() === store._id.toString());
            const total = storeRatings.reduce((acc, item) => acc + item.rating, 0);
            const averageRating = storeRatings.length > 0 ? (total / storeRatings.length).toFixed(1) : 0;
            
            const userSubmittedRating = userRatings.find(r => r.store.toString() === store._id.toString());

            return {
                ...store,
                overallRating: parseFloat(averageRating),
                userSubmittedRating: userSubmittedRating ? userSubmittedRating.rating : null,
                ratingId: userSubmittedRating ? userSubmittedRating._id : null,
            };
        });

        res.status(200).json({ success: true, count: storesWithRatings.length, data: storesWithRatings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};


exports.submitOrUpdateRating = async (req, res) => {
  const { rating } = req.body;
  const storeId = req.params.storeId;
  const userId = req.user.id;

  try {
    const existingRating = await Rating.findOne({ user: userId, store: storeId });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
      res.status(200).json({ success: true, data: existingRating });
    } else {
      const newRating = await Rating.create({
        rating,
        user: userId,
        store: storeId,
      });
      res.status(201).json({ success: true, data: newRating });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error submitting rating', error: error.message });
  }
};


exports.getStoreOwnerDashboard = async (req, res) => {
    try {
        const store = await Store.findOne({ owner: req.user.id });
        if (!store) {
            return res.status(404).json({ success: false, message: 'No store found for this owner.' });
        }

        const ratings = await Rating.find({ store: store._id }).populate('user', 'name email');

        const total = ratings.reduce((acc, item) => acc + item.rating, 0);
        const averageRating = ratings.length > 0 ? (total / ratings.length).toFixed(1) : 0;

        res.status(200).json({
            success: true,
            data: {
                storeName: store.name,
                averageRating: parseFloat(averageRating),
                ratings,
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};