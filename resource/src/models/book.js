const mongoose = require('mongoose');

const { Schema } = mongoose;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: false,
  },
  released: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    require: true,
  },
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
