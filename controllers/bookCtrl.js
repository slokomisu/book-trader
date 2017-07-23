const Book = require('../models/Book');
const User = require('../models/User');


exports.getAllBooks = async function(req, res) {
  try {
    let books = await Book.find({});
    res.json({
      books
    });
  } catch (error) {
    res.json(error);
  }
};

exports.addBook = async function(req, res) {
  try {
    const newBook = req.body.book;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        error: 'USER_NOT_FOUND'
      });
    }
    newBook.owner = user._id;
    const createdBook = await Book.create(newBook);
    user.books.push(createdBook);
    const savedUser = await user.save();
    res.json({
      message: 'Book added to user',
      savedUser
    });
  } catch (error) {
    res.json({
      error
    });
  }
};

exports.updateBook = async function(req, res) {
  const updatedBook = req.body.book;
  try {
    const bookToUpdate = await Book.findById(updatedBook._id);
    if (!bookToUpdate) {
      res.json({
        error: 'BOOK NOT FOUND'
      });
    }
    if (isBookOwner(req.user, bookToUpdate)) {
      Object.assign(bookToUpdate, updatedBook);
      const savedBook = await bookToUpdate.save();
      res.json({
        message: 'Book updated',
        savedBook
      });
    }
  } catch (error) {
    res.json({
      error
    });
  }
};

exports.deleteBook = async function(req, res) {
  const bookToDelete = req.body.book;
  try {
    const foundBook = await Book.findById(bookToDelete._id);
    if (isBookOwner(req.user, foundBook)) {
      const deletedBook = await foundBook.remove();
      res.json({
        message: 'Book deleted',
        deletedBook
      });
    }
  } catch (error) {
    res.json({ error });
  }
};

function isBookOwner(user, book) {
  return book.owner.toString() === user.id;
}

exports.getBooksForUser = async function(req, res) {
  try {
    const books = await Book.find({ owner: req.params.userId });
    res.json(books);
  } catch (error) {
    res.json(error);
  }
};
