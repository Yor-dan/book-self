import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { googleOauth } from './controllers/googleOauth';
import { googleOauthRedirect } from './controllers/googleOauthRedirect';
config();

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// connect to database
mongoose.set('strictQuery', true);
mongoose.connect(process.env.CONNECTION_STRING as string)
  .then(() => {
    app.listen(process.env.PORT);
    console.log(`Server running on http://localhost:${process.env.PORT}`);
  })
  .catch((err) => console.error(err));

// Route
app.get('/googleOauth', googleOauth);
app.get('/googleOauth/redirect', googleOauthRedirect);

app.use((req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});
