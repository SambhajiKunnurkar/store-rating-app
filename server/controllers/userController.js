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
    const users = await User.find(query);
    res.status(200).json({ success: true, count: users.length, data: users });
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