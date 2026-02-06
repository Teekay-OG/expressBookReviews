const express = require('express');
const axios = require('axios'); // Added for async HTTP requests
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// ---------------- User Registration (kept for reference) ----------------
public_users.post("/register", (req, res) => {
    return res.status(300).json({ message: "Use /customer/register instead" });
});

// ---------------- Task 10: Get the book list asynchronously ----------------
// ---------------- Task 10: Get the book list asynchronously (without Axios) ----------------
public_users.get('/books', async (req, res) => {
    try {
        // Simply return the local books object
        return res.status(200).json(books);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching books", error: err.message });
    }
});


// ---------------- Get book details based on ISBN ----------------
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// ---------------- Get book details based on author ----------------
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();
    const results = Object.values(books).filter(book => book.author.toLowerCase() === author);

    if (results.length > 0) {
        return res.status(200).json(results);
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// ---------------- Get book details based on title ----------------
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    const results = Object.values(books).filter(book => book.title.toLowerCase() === title);

    if (results.length > 0) {
        return res.status(200).json(results);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

// ---------------- Get book reviews ----------------
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn] && books[isbn].reviews) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "No reviews found for this book" });
    }
});

module.exports.general = public_users;
