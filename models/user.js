import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }, // for differentiating between admin and user
  createdAt: { type: Date, default: Date.now }
});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;

export default UserModel; 
