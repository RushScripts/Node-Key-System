const express = require('express');
const router = express.Router();
const Key = require('../models/Key');
const crypto = require('crypto');

function makeKey() {
  const buf = crypto.randomBytes(8).toString('hex');
  return `${buf.slice(0,4)}-${buf.slice(4,8)}-${buf.slice(8,12)}-${buf.slice(12,16)}`;
}
function getExpiryDate(hours = 24) {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

router.get('/get-key', async (req, res) => {
  try {
    const deviceId = req.cookies?.[process.env.KEY_COOKIE_NAME] || req.ip;
    const now = new Date();
    let existing = await Key.findOne({ deviceId, expiresAt: { $gt: now } }).exec();

    if (existing) return res.json({ ok: true, key: existing.key, expiresAt: existing.expiresAt });

    let newKey;
    for (let i = 0; i < 5; i++) {
      newKey = makeKey();
      if (!await Key.findOne({ key: newKey }).exec()) break;
      newKey = null;
    }
    if (!newKey) return res.status(500).json({ ok: false, message: 'Could not generate key' });

    const expiresAt = getExpiryDate(24);
    const keyDoc = new Key({ key: newKey, deviceId, expiresAt });
    await keyDoc.save();

    res.json({ ok: true, key: newKey, expiresAt });
  } catch (err) { res.status(500).json({ ok: false, message: 'Server error' }); }
});

router.post('/verify-key', async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) return res.status(400).json({ ok: false, message: 'Missing key' });

    const now = new Date();
    const doc = await Key.findOne({ key }).exec();
    if (!doc) return res.json({ ok: false, message: 'Invalid key' });
    if (doc.expiresAt <= now) return res.json({ ok: false, message: 'Key expired' });

    res.json({ ok: true, message: 'Key valid', expiresAt: doc.expiresAt });
  } catch (err) { res.status(500).json({ ok: false, message: 'Server error' }); }
});

router.get('/validate', async (req, res) => {
  try {
    const { key } = req.query;
    if (!key) return res.status(400).json({ ok: false, message: 'Missing key' });

    const now = new Date();
    const doc = await Key.findOne({ key }).exec();
    if (!doc) return res.json({ ok: false, message: 'Invalid key' });
    if (doc.expiresAt <= now) return res.json({ ok: false, message: 'Key expired' });

    res.json({ ok: true, message: 'Key valid', expiresAt: doc.expiresAt });
  } catch (err) { res.status(500).json({ ok: false, message: 'Server error' }); }
});

module.exports = router;
