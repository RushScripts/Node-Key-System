const mongoose = require('mongoose');

const KeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  deviceId: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, index: true }
});

KeySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Key', KeySchema);
