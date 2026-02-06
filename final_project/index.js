const express = require('express');
const jwt = require('jsonwebtoken');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// ---------------- JWT Middleware ----------------
// Apply to all /customer/auth/* routes
app.use("/customer/auth/*", (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: "User not logged in" });
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

    try {
        const payload = jwt.verify(token, "access_key"); // Verify JWT
        req.username = payload.username; // attach username
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
});

// ---------------- Route Mounting ----------------
app.use("/customer", customer_routes); // your auth routes
app.use("/", genl_routes);             // general routes

// ---------------- Start Server ----------------
const PORT = 5000;
app.listen(PORT, () => console.log("Server is running on port " + PORT));
