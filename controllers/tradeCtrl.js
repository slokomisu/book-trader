const Book = require('../models/Book');
const User = require('../models/User');
const Trade = require('../models/Trade');

exports.createTrade = async function(req, res) {
  const requestedBook = req.body.requestedBook;
  try {
    const requestedBookOwner = await User.findById(requestedBook.owner);
    if (requestedBookOwner._id.toString() === req.user.id) {
      return res.json({error: "Cannot send a trade to yourself"});
    }
    if (!requestedBookOwner) {
      return res.json({error: 'Requested book owner doesn\'t exist'})
    }
    const senderId = req.user.id;
    const receiverId = requestedBookOwner._id;
    const trade = {
      receiver: receiverId,
      sender: senderId,
      requestedBook: requestedBook._id,
      status: 'OPEN'
    }
    const newTrade = await Trade.create(trade);
    res.json({trade: newTrade});

  } catch (error) {
    res.json(error)
  }
}

exports.acceptTrade = async function(req, res) {
  try {
    const trade = await Trade.findById(req.params.id).populate('requestedBook exhangeBook').exec();
    const { requestedBook, exchangeBook } = trade;
    // Swap owners of the books
    // This is the person that the trade has been requested of accepting the 
    // trade.... So sender will get the requested book and the receiver will get the exchange book if there is one

    // First need to make sure that the person calling this endpoint is in fact the receiver
    if (!trade.receiver === req.user.id) {
      res.json({error: 'NOT_TRADE_RECEIVER'});
    }    
    // If we are the receiver of this trade then we swap the books' owner
    requestedBook.owner = trade.sender;
    await requestedBook.save();
    if (exchangeBook) {
      exchangeBook.owner = trade.receiver;
      await exchangeBook.save()
    }

    // Finally we set the trade's status to 'ACCEPTED'
    trade.status = 'ACCEPTED';
    const savedTrade = await trade.save();
    
    // Send the saved trade back to the frontend
    res.json({trade: savedTrade});
  } catch (error) {
    res.json(error);
  }

}