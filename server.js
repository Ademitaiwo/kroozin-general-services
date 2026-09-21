const express = require("express");
const path = require("path");
const cors = require("cors");
const { Pool } = require("pg");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Supabase PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

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
app.post("/api/quotes", async (req, res) => {
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

    try {
        // Save quote request to Supabase
        const result = await pool.query(
            `INSERT INTO quote_requests
            (name, email, phone, service, message)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, created_at`,
            [
                name,
                email,
                phone || null,
                service || null,
                message
            ]
        );

        console.log("====================================");
        console.log("NEW KROOZ'IN QUOTE REQUEST SAVED");
        console.log("====================================");
        console.log("ID:", result.rows[0].id);
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

    } catch (error) {
        console.error("Database error:", error);

        res.status(500).json({
            success: false,
            message: "We could not save your quote request. Please try again."
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`KROOZ'IN server running on port ${PORT}`);
});