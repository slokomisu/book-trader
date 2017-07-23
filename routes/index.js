const router = require('express').Router();
const Book = require('../models/Book');
const User = require('../models/User');
const Trade = require('../models/Trade');
const passport = require('passport');
const jwtAuth = require('express-jwt')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const bookCtrl = require('../controllers/bookCtrl');
const authCtrl = require('../controllers/authCtrl');
const tradeCtrl = require('../controllers/tradeCtrl');
require('dotenv').config();


router.get('/:userId/books', bookCtrl.getBooksForUser);

router.use('/trades', jwtAuth({secret: process.env.SECRET}));
router.post('/trades/createTrade', tradeCtrl.createTrade)
router.get('/trades/acceptTrade/:id', tradeCtrl.acceptTrade)
router.get('/trades', tradeCtrl.getTrades);
router.put('/trades/denyTrade/:id', tradeCtrl.denyTrade);
// router.delete('/trades/closeTrade/:id', tradeCtrl.closeTrade);


router.route('/books')
  .get(bookCtrl.getAllBooks)
  .post(jwtAuth({secret: process.env.SECRET}), bookCtrl.addBook)
  .put(jwtAuth({secret: process.env.SECRET}), bookCtrl.updateBook)
  .delete(jwtAuth({secret: process.env.SECRET}), bookCtrl.deleteBook)

router.post('/login', passport.authenticate('local'), authCtrl.login)

router.post('/register', authCtrl.register)





module.exports = router;