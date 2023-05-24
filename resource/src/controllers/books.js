/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
require('dotenv').config();
const Book = require('../models/book');

const getAllBooks = async (req, res) => {
  try {
    const allBooks = await Book.find({ email: req.user.email }).sort({ title: 1 });
    return res.status(200)
      .header('Cache-Control', 'no-cache, no-store, must-revalidate')
      .header('Pragma', 'no-cache')
      .header('Expires', '0')
      .render('home', { title: 'Home', books: allBooks });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
};

const addBookForm = async (req, res) => res.render('forms/addBookForm', { title: 'Add new book' });

const deleteBookById = async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    return res.status(200).json({ redirect: '/books' });
  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      return res.status(404).render('404', { title: '404' });
    }
    return res.status(500).send('Internal Server Error');
  }
};

const addNewBook = async (req, res) => {
  const {
    title,
    author,
    released,
    status,
  } = req.body;

  try {
    const book = new Book({
      title,
      author,
      released,
      status,
      email: req.user.email,
    });
    await book.save();
    return res.status(200).redirect('/books');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
};

const editBookForm = async (req, res) => {
  const id = req.path.slice(1);
  const book = await Book.findById(id);
  res.render('forms/editBookForm', { title: 'Edit Book', id, book });
};

const editBookById = async (req, res) => {
  const { id } = req.params;
  await Book.findByIdAndUpdate(id, req.body);
  return res.status(200).json({ redirect: '/books' });
};

module.exports = {
  getAllBooks,
  addBookForm,
  deleteBookById,
  addNewBook,
  editBookForm,
  editBookById,
};
