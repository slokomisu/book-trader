const router = require('express').Router();
const passport = require('passport');
const jwtAuth = require('express-jwt');

const bookCtrl = require('../controllers/bookCtrl');
const authCtrl = require('../controllers/authCtrl');
const tradeCtrl = require('../controllers/tradeCtrl');
require('dotenv').config();

router.get('/:userId/books', bookCtrl.getBooksForUser);

router.use('/trades', jwtAuth({ secret: process.env.SECRET }));
router.post('/trades/createTrade', tradeCtrl.createTrade);
router.get('/trades/acceptTrade/:id', tradeCtrl.acceptTrade);
router.get('/trades', tradeCtrl.getTrades);
router.put('/trades/denyTrade/:id', tradeCtrl.denyTrade);
router.delete('/trades/closeTrade/:id', tradeCtrl.closeTrade);
router.post('/trades/addExchangeBook/:id', tradeCtrl.addExchangeBook);

router.get('/books', bookCtrl.getAllBooks);
router.get('/books/:id', bookCtrl.getBookById);
router.post('/books', jwtAuth({ secret: process.env.SECRET }), bookCtrl.addBook);
router.put('/books/:id', jwtAuth({ secret: process.env.SECRET }), bookCtrl.updateBook);
router.delete('/books/:id', jwtAuth({ secret: process.env.SECRET }), bookCtrl.deleteBook);

router.post('/login', passport.authenticate('local'), authCtrl.login);
router.post('/register', authCtrl.register);

router.post('/google/bookSearch', bookCtrl.googleBookSearch);

module.exports = router;
