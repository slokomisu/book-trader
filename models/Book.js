const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {type: String, required: true},
  author: {type: String, required: true},
  isbn: {type: String, required: true},
  coverImage: {type: String, required: true},
  publisher: {type: String, required: true},
  publicationDate: {type: Date, required: true},
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});
const Book = mongoose.model('Book', bookSchema);
module.exports = Book;