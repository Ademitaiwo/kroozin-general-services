const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the existing KROOZ'IN website
app.use(express.static(__dirname));

// Backend health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "KROOZ'IN backend is running successfully."
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`KROOZ'IN server running on port ${PORT}`);
});