import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  permissions: Number, // bit field representing permissions held by this admin
});

export default mongoose.model('Admins', adminSchema);
