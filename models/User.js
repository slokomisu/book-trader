const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }],
  sentTrades: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trade'
  }],
  receivedTrades: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trade'
  }],
})
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema)
module.exports = User;