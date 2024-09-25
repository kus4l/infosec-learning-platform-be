import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  privileges: { type: [String], default: ['view_users', 'manage_users'] },
  createdAt: { type: Date, default: Date.now }
});

const AdminModel = mongoose.model('Admin', AdminSchema);

export default AdminModel;
