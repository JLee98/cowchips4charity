import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  amount: Number, // in cents
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  organizationID: { type: mongoose.Schema.Types.ObjectId, ref: 'Organizations' },
  gameID: { type: mongoose.Schema.Types.ObjectId, ref: 'Games' },
  stripeID: String, // TODO add to data model
  date: Date,
  tiles: [Number],
});

export default mongoose.model('Donations', donationSchema);
