const express = require('express');
const public_users = express.Router();
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

// ---------------- User Registration (kept for reference) ----------------
public_users.post("/register", (req, res) => {
    return res.status(300).json({ message: "Use /customer/register instead" });
});

// ---------------- Task 10: Get the book list asynchronously ----------------
public_users.get('/books', async (req, res) => {
    try {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 0));
        return res.status(200).json(books);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching books", error: err.message });
    }
});

// ---------------- Task 2: Get book details based on ISBN (async) ----------------
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        // Simulate async operation with a Promise
        const book = await new Promise((resolve, reject) => {
            setTimeout(() => {
                if (books[isbn]) resolve(books[isbn]);
                else reject(new Error("Book not found"));
            }, 0);
        });

        return res.status(200).json(book);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
});

// ---------------- Get book details based on author ----------------
// ---------------- Task 3: Get book details based on author (async) ----------------
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();

    try {
        // Simulate async fetch with a Promise
        const results = await new Promise((resolve, reject) => {
            setTimeout(() => {
                const booksByAuthor = Object.values(books).filter(
                    book => book.author.toLowerCase() === author
                );
                if (booksByAuthor.length > 0) resolve(booksByAuthor);
                else reject(new Error("No books found by this author"));
            }, 0);
        });

        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
});


// ---------------- Get all books based on title ----------------
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
