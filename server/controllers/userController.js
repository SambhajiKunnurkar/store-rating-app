const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body); 
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating user', error: error.message });
  }
};


exports.getUsers = async (req, res) => {
  const { name, email, address, role } = req.query;
  let query = {};

  if (name) query.name = { $regex: name, $options: 'i' };
  if (email) query.email = { $regex: email, $options: 'i' };
  if (address) query.address = { $regex: address, $options: 'i' };
  if (role) query.role = role;

  try {
    const users = await User.find(query).lean();

    const allStores = await Store.find({});
    const allRatings = await Rating.find({});

    const usersWithStoreData = users.map(user => {
        if (user.role === 'Store Owner') {
            
            const ownedStores = allStores.filter(store => store.owner.toString() === user._id.toString());
            
            if (ownedStores.length > 0) {
                
            
                const storeAverages = ownedStores.map(store => {
                    const storeRatings = allRatings.filter(r => r.store.toString() === store._id.toString());
                    if (storeRatings.length === 0) return 0;
                    const total = storeRatings.reduce((acc, item) => acc + item.rating, 0);
                    return total / storeRatings.length;
                });

                
                const totalAverage = storeAverages.reduce((acc, avg) => acc + avg, 0) / ownedStores.length;
                
                return { ...user, storeRating: totalAverage.toFixed(1) };
            }
        }
        return user;
    });

    res.status(200).json({ success: true, count: usersWithStoreData.length, data: usersWithStoreData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getAdminDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStores = await Store.countDocuments();
        const totalRatings = await Rating.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalStores,
                totalRatings
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating user role', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    
    if (user.role === 'Store Owner') {
        
        const stores = await Store.find({ owner: user._id });
        if (stores && stores.length > 0) {
            
            for (const store of stores) {
                await Rating.deleteMany({ store: store._id });
            }
            
            await Store.deleteMany({ owner: user._id });
        }
    }

    await user.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error deleting user', error: error.message });
  }
};