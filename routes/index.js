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
require('dotenv').config();


router.get('/:username/books', (req, res) => {
    User.findByUsername(req.params.username)
      .populate('books')
      .exec()
      .then(foundUser => {
        res.json({books: foundUser.books})
      })
});

router.use('/trades', jwtAuth({secret: process.env.SECRET}), require('./trades.js'));


router.route('/books')
  .get(bookCtrl.getAllBooks)
  .post(jwtAuth({secret: process.env.SECRET}), bookCtrl.addBook)
  .put(jwtAuth({secret: process.env.SECRET}), bookCtrl.updateBook)
  .delete(jwtAuth({secret: process.env.SECRET}), bookCtrl.deleteBook)

router.post('/login', passport.authenticate('local'), authCtrl.login)

router.post('/register', authCtrl.register)





module.exports = router;