const passport = require('passport');
const User = require('../models/User');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(app) {
  passport.use(new LocalStrategy(User.authenticate()))
  passport.serializeUser(User.serializeUser())
  passport.deserializeUser(User.deserializeUser());
  app.use(passport.initialize());
}