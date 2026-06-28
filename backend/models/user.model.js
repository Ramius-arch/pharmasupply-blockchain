// models/user.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
  role: {
    type: String,
    default: 'user',
    enum: ['admin', 'supplier', 'user'] // Define allowed roles
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive', 'pending']
  },
  walletAddress: { type: String, default: null }, // Blockchain wallet address
  passwordResetToken: { type: String, default: null, select: false },
  passwordResetExpires: { type: Date, default: null, select: false }
}, { timestamps: true });

// Ensure password is never included in JSON or plain-object serialization
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});

UserSchema.set('toObject', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model('User', UserSchema);
