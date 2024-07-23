const express = require('express')
const User = require('../models/user')
const passport = require('passport')

const router = express.Router()

router.post('/register', notAuthenticated, async function(req, res) {
  try {
    const {name, email, password} = req.body
    const user = new User({name, email, password})
    await user.save()
    return res.status(201).json(user)
  } 
  catch(err) {
    return res.status(400).json(err)
  }
})

router.post('/login', notAuthenticated, passport.authenticate('local'), async function (req, res){
  return res.status(201).json(req.user)
})

function authenticated(req, res, next) {
  if(!req.user) return res.status(401).send('Not authenticated')
  return res.status(401).send('Not authenticated')
}
function notAuthenticated(req, res, next) {
  if(req.user) return res.status(403).send('Already authenticated')
  return next()
}

module.exports = router