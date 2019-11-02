import mongoose from 'mongoose';

const DEFAULT_TILE_PRICE = 100; // in cents

const gameSchema = new mongoose.Schema({
  name: String, // TODO add to data model
  organizations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Organizations' }],
  startTime: Date,
  endTime: Date,
  winningTile: { type: Number, default: null },
  board: [Number], // TODO update in data model
  price: { type: Number, default: DEFAULT_TILE_PRICE }, // in cents
  streamUrl: String,
});

export default mongoose.model('Games', gameSchema);
