import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  dob: Date,
  location: {
    address: String,
    state: String,
    zip: String,
    city: String,
  },
});

export default mongoose.model('Users', userSchema);
