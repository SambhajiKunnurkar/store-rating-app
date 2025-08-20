
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    minlength: 20, 
    maxlength: 60, 
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [ 
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 8, 
    select: false, 
  },
  address: {
    type: String,
    maxlength: 400, 
  },
  role: {
    type: String,
    enum: ['Normal User', 'Store Owner', 'System Administrator'], 
    default: 'Normal User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);