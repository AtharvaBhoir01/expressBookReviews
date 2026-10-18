const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered. Now you may login" });
});

// Task 1: Get all books
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Task 2: Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(book);
});

// Task 3: Get books by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  const result = Object.values(books).filter(
    book => book.author && book.author.toLowerCase() === author
  );

  return res.status(200).json(result);
});

// Task 4: Get books by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const result = Object.values(books).filter(
    book => book.title && book.title.toLowerCase() === title
  );

  return res.status(200).json(result);
});

// Task 5: Get reviews for a book
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(book.reviews || {});
});


// ASYNC AXIOS TASKS 10-13
const axios = require("axios");
const BASE_URL = "http://localhost:5000";

// Task 10: Get all books using async/await and Axios
public_users.get("/async", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve books" });
  }
});

// Task 11: Get a book by ISBN using a Promise
public_users.get("/async/isbn/:isbn", (req, res) => {
  axios.get(`${BASE_URL}/isbn/${encodeURIComponent(req.params.isbn)}`)
    .then(response => res.status(200).json(response.data))
    .catch(() => res.status(500).json({ message: "Unable to retrieve book" }));
});

// Task 12: Get books by author using async/await and Axios
public_users.get("/async/author/:author", async (req, res) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/author/${encodeURIComponent(req.params.author)}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve books by author" });
  }
});

// Task 13: Get books by title using a Promise
public_users.get("/async/title/:title", (req, res) => {
  axios.get(`${BASE_URL}/title/${encodeURIComponent(req.params.title)}`)
    .then(response => res.status(200).json(response.data))
    .catch(() => res.status(500).json({ message: "Unable to retrieve books by title" }));
});

module.exports.general = public_users;
