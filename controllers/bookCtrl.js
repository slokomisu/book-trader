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
    await user.save();
    res.json({
      createdBook
    });
  } catch (error) {
    res.json({
      error
    });
  }
};

exports.updateBook = async function(req, res) {
  const bookId = req.params.id;
  try {
    const bookToUpdate = await Book.findById(bookId);
    if (!bookToUpdate) {
      res.json({
        error: 'BOOK NOT FOUND'
      });
    }
    if (isBookOwner(req.user, bookToUpdate)) {
      Object.assign(bookToUpdate, bookId);
      const savedBook = await bookToUpdate.save();
      res.json({
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
  const bookId = req.params.id;
  try {
    const foundBook = await Book.findById(bookId);
    if (isBookOwner(req.user, foundBook)) {
      const deletedBook = await foundBook.remove();
      res.json({
        deletedBook
      });
    }
  } catch (error) {
    res.json({ error });
  }
};

exports.getBookById = async function(req, res) {
  const bookId = req.params.id;
  try {
    const foundBook = await Book.findById(bookId);
    if (!foundBook) {
      return res.json({ error: 'BOOK_NOT_FOUND' });
    }
    res.json({
      book: foundBook
    });
  } catch (error) {}
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
