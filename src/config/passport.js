const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const mongoose = require('mongoose')
const User = require('../models/User');

passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  // ver si coinciden mail de request y almacenado
  const user = await User.findOne({email: email});
  if (!user) {
    return done(null, false, { message: 'Usuario no encontrado' })
  } else {
    // ver si coincide la 
    const match = await user.matchPassword(password);
    if(match) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Contraseña incorrecta' })
    }
  }
}))

passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})
