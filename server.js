require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

const rateLimit = require('./middleware/rate-limit');
const keysRoute = require('./routes/Keys');

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Mongo connected'))
  .catch(err => { console.error(err); process.exit(1); });

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/get-key', rateLimit());
app.use('/api', keysRoute);

app.get('/health', (req, res) => res.json({ ok: true, time: new Date() }));

app.listen(process.env.PORT || 3000, () =>
  console.log('Server running on port', process.env.PORT || 3000)
);
