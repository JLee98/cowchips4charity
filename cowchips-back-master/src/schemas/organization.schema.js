import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  name: String,
  photo: String,
  abbreviation: String,
  email: String,
});

export default mongoose.model('Organizations', organizationSchema);
