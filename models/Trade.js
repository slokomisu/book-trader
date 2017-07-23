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
  senderBooks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Book'}],
  receiverBooks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Book'}],
  status: {
    type: String,
    enum: ['OPEN', 'ACCEPTED', 'DENIED'],
    default: 'OPEN'
  },

});

const Trade = mongoose.model('Trade', tradeSchema);
module.exports = Trade;