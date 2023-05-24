import { Request, Response } from 'express';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { oauth2Client } from './googleOauth';
import { User } from '../models/user';
config();

export const googleOauthRedirect = async (req: Request, res: Response) => {
  const { code } = req.query;

  try {
    // getting access token for user data
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    // request for user data
    const { data } = await google.people({ version: 'v1', auth: oauth2Client }).people.get({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses',
    });

    // set user data
    const { names, emailAddresses } = data;
    const name = names?.[0]?.displayName;
    const email = emailAddresses?.[0]?.value;
    
    // check user in database
    const user = await User.findOne({ email });
    if(!user) {
      const newUser = new User({ email, name });
      newUser.save();
    }

    // set session and redirect back to client
    const session = jwt.sign({ email }, process.env.TOKEN_SECRET as string);
    return res.status(300).cookie('session', session, { httpOnly: true, maxAge: 604800000 })
      .redirect(process.env.RESOURCE_SERVER as string);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Something went wrong, try again later!');
  }
};
