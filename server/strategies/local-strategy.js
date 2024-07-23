// import passport from "passport";
// import { Strategy } from "passport-local";
// import User from "../models/user.js";
const passport = require('passport')
const Strategy = require('passport-local')
const User = require('../models/user')

passport.serializeUser((user, done) => {console.log('ser');done(null, user.email)})

passport.deserializeUser(async (email, done) => {
  console.log('deser')
  try {
    const user = await User.findOne({email: email})
    if(!user) throw new Error('User not found')
    done(null, user)
  }
  catch(err) {
    done(err, null)
  }
})

passport.use(new Strategy({usernameField: 'email'}, async (email, password, done) => {
  try {
    const user = await User.findOne({email: email})
    if(!user) throw new Error('User not found')
    if(!await user.comparePassword(password)) throw new Error('Bad Credentials')
    done(null, user)
  }
  catch(err) {
    done(err, null)
  }
}))