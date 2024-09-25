import mongoose from 'mongoose';

const LoginSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
});

export const LoginModel = mongoose.model('Credentials', LoginSchema);