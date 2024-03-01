import { Login,Register} from '../controllers/Auth.js';
import {AddResume, updateUser} from '../controllers/User.js'
import passport from 'passport'
import express from 'express';
import verify from '../verify.js';
const app=express();
app.post('/register',Register);
app.post('/login',Login);
app.post('/add',verify,AddResume)
app.post('/update',verify,updateUser)
/*
// Route to initiate Google OAuth2 authentication
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Route to handle the Google OAuth2 callback
app.get('/auth/google/callback', passport.authenticate('google', { session: false,successRedirect:'http://localhost:3000/' }), (req, res) => {
  // Redirect or send a response with the JWT token
  const token = req.user.token;
  res.json({ token });
});
*/
export default app;