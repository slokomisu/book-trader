const router = require('express').Router();
const Book = require('../models/Book');
const User = require('../models/User');
const Trade = require('../models/Trade');
const jwtAuth = require('express-jwt')




router.post('/', (req, res) => {
  const senderBooks = req.body.senderBooks;
  const receiverBooks = req.body.receiverBooks;
  const receiver = req.body.receiver;
  const sender = req.user;
  // get the receiver
  User.findById(receiver._id)
    .then(foundReceiver => {
      if (!foundReceiver) {
        return res.json({error: 'USER_NOT_EXIST'})
      }
      // get the from user
      User.findById(sender.id)
        .then(foundSender => {
          const newTrade = {
            receiver: foundReceiver,
            sender: foundSender,
            receiverBooks,
            senderBooks,
            status: 'OPEN'
          };
          Trade.create(newTrade)
            .then(createdTrade => {
              res.json(createdTrade);
            })
            .catch(err => res.json(err))
        }) 

    })
});

router.patch('/:id/status', (req, res) => {
  const updatedStatus = req.body.updatedStatus;
  Trade.findByIdAndUpdate(req.params.id, {status: updatedStatus})
    .then(updatedTrade => {
      res.json(updatedTrade)
    })
});

// Add book to trade
router.patch('/:id/books', (req, res) => {
  Trade.findById(req.params.id)
})


module.exports = router;