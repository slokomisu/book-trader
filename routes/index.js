const router = require('express').Router();
const Book = require('../models/Book');
const User = require('../models/User');
const Trade = require('../models/Trade');
const passport = require('passport');
const jwtAuth = require('express-jwt')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
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
  .get((req, res) => {
    Book.find({})
      .then(books => {
        res.json({
          books
        })
      })
      .catch(err => {
        res.json({
          error: err
        })
      })
  })
  .post(jwtAuth({
    secret: process.env.SECRET
  }), (req, res) => {
    const newBook = req.body.book;

    const userId = req.user.id;
    User.findById(userId)
      .then(user => {
        console.log('found user', user)
        if (!user) {
          return res.json({error: 'USER_NOT_FOUND'});
        }
        newBook.owner = user._id;
        Book.create(newBook)
          .then(createdBook => {
            console.log('created book', createdBook);
            user.books.push(createdBook);
            user.save()
              .then(user => {
                console.log('book on user', user);
                res.json({
                  message: 'Book added to user',
                  user
                })
              })
              .catch(err => res.json(err))
          })
          .catch(err => res.json(err))
      })
      .catch(err => res.json(err))
  })
  .put(jwtAuth({
    secret: process.env.SECRET
  }), (req, res) => {
    const updatedBook = req.body.book;
    Book.findById(updatedBook._id)
      .then(book => {
        if (book) {
          if (book.owner.toString() === req.user.id) {
            Object.assign(book, updatedBook);
            book.save()
              .then(book => {
                res.json({
                  message: 'Book updated',
                  book
                });
              })
              .catch(err => res.json(err));
          } else {
            return res.json({
              error: 'NOT_BOOK_OWNER'
            })
          }
        } else {
          return res.json({error: 'BOOK_NOT_EXIST'});
        }
      })
      .catch(err => res.json(err))
  })
  .delete(jwtAuth({secret: process.env.SECRET}), (req, res) => {
    const bookToDelete = req.body.book;
    Book.findById(bookToDelete._id)
      .then(foundBook => {
        if (foundBook._id.toString() === req.user.id) {
          foundBook.remove()
            .then(deletedBook => {
              res.json({message: 'Book deleted', deletedBook})
            })
        } else {
          return res.json({error: 'NOT_BOOK_OWNER'});
        }
      })
      .catch(err => res.json(err))
  })

router.post('/login', passport.authenticate('local'), (req, res) => {
  const user = req.user;
  const payload = {
    id: req.user._id,
    username: user.username,
    books: user.books
  }
  const token = jwt.sign(payload, process.env.SECRET)
  res.json({
    token
  });
})

router.post('/register', (req, res) => {
  User.register(new User({
    username: req.body.username
  }), req.body.password, (err, user) => {
    if (err) {
      console.log('there was a problem registering user')
      res.json(err);
    } else {
      const payload = {
        id: user._id,
        username: user.username,
        books: user.books
      };
      const token = jwt.sign(payload, process.env.SECRET);
      res.json({token});
    }
  })
})





module.exports = router;