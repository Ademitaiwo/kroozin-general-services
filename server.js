// const express = require("express");
// const path = require("path");
// require("dotenv").config();


const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve the existing KROOZ'IN website
app.use(express.static(__dirname));

// Backend health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "KROOZ'IN backend is running successfully."
    });
});

// Receive quote requests
app.post("/api/quotes", (req, res) => {
    const {
        name,
        company,
        email,
        phone,
        service,
        message
    } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "Name, email and message are required."
        });
    }

    // For now, display the enquiry in the server console.
    console.log("====================================");
    console.log("NEW KROOZ'IN QUOTE REQUEST");
    console.log("====================================");
    console.log("Name:", name);
    console.log("Company:", company || "Not provided");
    console.log("Email:", email);
    console.log("Phone:", phone || "Not provided");
    console.log("Service:", service || "Not specified");
    console.log("Message:", message);
    console.log("====================================");

    res.json({
        success: true,
        message: "Your quote request has been received successfully."
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`KROOZ'IN server running on port ${PORT}`);
});