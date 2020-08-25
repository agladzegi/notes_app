const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

require('dotenv').config();
const middlewares = require('./middlewares/middlewares');
const auth = require('./auth/auth.routes');
const notes = require('./notes/notes.routes');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(helmet());
app.use(morgan('common'));
app.use(express.json());
app.use(middlewares.checkTokenSetUser);

app.get('/', (req, res) => {
  res.json({ message: 'Hello 👍' });
});

app.use('/api/v1/auth', auth);
app.use('/api/v1/notes', middlewares.isLoggedIn, notes);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
