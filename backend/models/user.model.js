// models/user.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  role: {
    type: String,
    default: 'user',
    enum: ['admin', 'supplier', 'user'] // Define allowed roles
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive', 'pending']
  }
});

module.exports = mongoose.model('User', UserSchema);
