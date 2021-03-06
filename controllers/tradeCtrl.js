const Book = require('../models/Book');
const User = require('../models/User');
const Trade = require('../models/Trade');

exports.createTrade = async function(req, res) {
  const requestedBook = req.body.requestedBook;
  try {
    const requestedBookOwner = await User.findById(requestedBook.owner);
    if (requestedBookOwner._id.toString() === req.user.id) {
      return res.json({ error: 'Cannot send a trade to yourself' });
    }
    if (!requestedBookOwner) {
      return res.json({ error: "Requested book owner doesn't exist" });
    }
    const senderId = req.user.id;
    const receiverId = requestedBookOwner._id;
    const trade = {
      receiver: receiverId,
      sender: senderId,
      requestedBook: requestedBook._id,
      status: 'OPEN'
    };
    const newTrade = await Trade.create(trade);
    res.json(newTrade);
  } catch (error) {
    res.json(error);
  }
};

exports.acceptTrade = async function(req, res) {
  try {
    const trade = await Trade.findById(req.params.id).populate('requestedBook exhangeBook').exec();
    const { requestedBook, exchangeBook } = trade;
    // Swap owners of the books
    // This is the person that the trade has been requested of accepting the
    // trade.... So sender will get the requested book and the receiver will get the exchange book if there is one

    // First need to make sure that the person calling this endpoint is in fact the receiver
    if (!trade.receiver === req.user.id) {
      res.json({ error: 'NOT_TRADE_RECEIVER' });
    }
    // If we are the receiver of this trade then we swap the books' owner
    requestedBook.owner = trade.sender;
    await requestedBook.save();
    if (exchangeBook) {
      exchangeBook.owner = trade.receiver;
      await exchangeBook.save();
    }

    // Finally we set the trade's status to 'ACCEPTED'
    trade.status = 'ACCEPTED';
    const savedTrade = await trade.save();

    // Send the saved trade back to the frontend
    res.json(savedTrade);
  } catch (error) {
    res.json(error);
  }
};

exports.getTrades = async function(req, res) {
  try {
    const receivedTrades = await Trade.find({ receiver: req.user.id });
    const sentTrades = await Trade.find({ sender: req.user.id });
    res.json({
      sentTrades,
      receivedTrades
    });
  } catch (error) {
    res.json(error);
  }
};

exports.denyTrade = async function(req, res) {
  try {
    const tradeId = req.body.tradeId;
    const deniedTrade = await Trade.findByIdAndUpdate(tradeId, { status: 'DENIED' });
    res.json(deniedTrade);
  } catch (error) {
    res.json(error);
  }
};

exports.closeTrade = async function(req, res) {
  try {
    const tradeId = req.body.tradeId;
    const closedTrade = await Trade.findByIdAndUpdate(tradeId, { status: 'CLOSED' });
    res.json(closedTrade);
  } catch (error) {
    res.json(error);
  }
};

exports.addExchangeBook = async function(req, res) {
  try {
    const book = req.body.book;
    const foundBook = await Book.findById(book.id);
    if (!foundBook) {
      return res.json({error: 'BOOK_NOT_FOUND'});
    }
    const tradeId = req.body.tradeId;
    const foundTrade = await Trade.findById(tradeId);
    foundTrade.exchangeBook = foundBook._id;
    await foundTrade.save();
    res.json(foundTrade);
  } catch (error) {
    res.json(error);
  }
}
