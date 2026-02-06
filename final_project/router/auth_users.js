const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // Array to store registered users

// ------------------- User Helpers -------------------
const isValid = (username) => users.some(user => user.username === username);
const authenticatedUser = (username, password) => users.some(user => user.username === username && user.password === password);

// ------------------- Routes -------------------

// Register
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ message: "Username and password required" });
    if (isValid(username)) return res.status(409).json({ message: "Username already exists" });

    users.push({ username, password });
    return res.status(200).json({ message: `User ${username} registered successfully` });
});

// Login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ message: "Username and password required" });
    if (!authenticatedUser(username, password)) return res.status(401).json({ message: "Invalid username or password" });

    const token = jwt.sign({ username }, "access_key", { expiresIn: "1h" });
    return res.status(200).json({ message: `User ${username} logged in successfully`, token });
});

// Add or update a review (JWT required)
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.username;

    if (!isbn || !review) return res.status(400).json({ message: "ISBN and review are required" });
    if (!books[isbn]) return res.status(404).json({ message: "Book not found" });

    if (!books[isbn].reviews) books[isbn].reviews = {};
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: `Review for ISBN ${isbn} added/updated successfully`,
        reviews: books[isbn].reviews
    });
});

// Delete a review (JWT required)
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.username;

    if (!isbn) return res.status(400).json({ message: "ISBN is required" });
    if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
    if (!books[isbn].reviews || !books[isbn].reviews[username]) return res.status(404).json({ message: "No review found for this user" });

    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: `Review for ISBN ${isbn} deleted successfully`,
        reviews: books[isbn].reviews
    });
});

// --------------------------------------------------------
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
