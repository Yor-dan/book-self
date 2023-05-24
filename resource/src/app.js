/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const booksRoutes = require('./routes/booksRoutes');
const { login, getUser, logout } = require('./controllers/auth');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
const port = 5000;

mongoose.set('strictQuery', true);
mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port);
    console.log(`Server running on http://localhost:${port}`);
  })
  .catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use('/public', express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', login);

app.use('/books', getUser, booksRoutes);

app.get('/logout', logout);

app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
