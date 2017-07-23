const mongoose = require('mongoose')

const tradeSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  requestedBook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  },
  exchangeBook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  },
  status: {
    type: String,
    enum: ['OPEN', 'ACCEPTED', 'DENIED'],
    default: 'OPEN'
  },

});

const Trade = mongoose.model('Trade', tradeSchema);
module.exports = Trade;