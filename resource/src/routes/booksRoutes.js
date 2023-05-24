/* eslint-disable no-console */
const express = require('express');
const books = require('../controllers/books');

const router = express.Router();

router.get('/', books.getAllBooks);
router.post('/', books.addNewBook);
router.get('/new', books.addBookForm);
router.get('/:id', books.editBookForm);
router.put('/:id', books.editBookById);
router.delete('/:id', books.deleteBookById);

module.exports = router;
