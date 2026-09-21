const express = require("express");
const path = require("path");
const cors = require("cors");
const { Pool } = require("pg");
const session = require("express-session");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// =====================================================
// CONNECT TO SUPABASE POSTGRESQL
// =====================================================

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Trust Render's proxy so secure session cookies work
app.set("trust proxy", 1);

// Admin login sessions
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 8
    }
}));

// =====================================================
// PROTECT ADMIN DASHBOARD PAGE
// =====================================================

app.get("/admin.html", (req, res, next) => {

    if (req.session && req.session.isAdmin) {
        return next();
    }

    res.redirect("/admin-login.html");
});

// =====================================================
// SERVE KROOZ'IN WEBSITE
// =====================================================

app.use(express.static(__dirname));

// =====================================================
// BACKEND HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        message: "KROOZ'IN backend is running successfully."
    });

});

// =====================================================
// RECEIVE QUOTE REQUESTS
// =====================================================

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

// =====================================================
// ADMIN LOGIN
// =====================================================

app.post("/api/admin/login", (req, res) => {

    const {
        username,
        password
    } = req.body;

    // Check admin credentials
    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {

        req.session.isAdmin = true;

        return res.json({
            success: true,
            message: "Admin login successful."
        });

    }

    res.status(401).json({
        success: false,
        message: "Invalid username or password."
    });

});

// =====================================================
// ADMIN AUTHENTICATION MIDDLEWARE
// =====================================================

function requireAdmin(req, res, next) {

    if (req.session && req.session.isAdmin) {
        return next();
    }

    res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in as an administrator."
    });

}

// =====================================================
// GET QUOTE REQUESTS FOR ADMIN DASHBOARD
// =====================================================

app.get("/api/admin/quotes", requireAdmin, async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT
                id,
                name,
                email,
                phone,
                service,
                message,
                created_at
             FROM quote_requests
             ORDER BY created_at DESC`
        );

        res.json({
            success: true,
            quotes: result.rows
        });

    } catch (error) {

        console.error("Error loading quote requests:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load quote requests."
        });

    }

});

// =====================================================
// DELETE A QUOTE REQUEST
// =====================================================

app.delete("/api/admin/quotes/:id", requireAdmin, async (req, res) => {

    const { id } = req.params;

    try {

        const result = await pool.query(
            `DELETE FROM quote_requests
             WHERE id = $1
             RETURNING id`,
            [id]
        );

        if (result.rowCount === 0) {

            return res.status(404).json({
                success: false,
                message: "Quote request not found."
            });

        }

        res.json({
            success: true,
            message: "Quote request deleted successfully."
        });

    } catch (error) {

        console.error("Error deleting quote request:", error);

        res.status(500).json({
            success: false,
            message: "Unable to delete quote request."
        });

    }

});

// =====================================================
// ADMIN LOGOUT
// =====================================================

app.post("/api/admin/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {

            console.error("Logout error:", error);

            return res.status(500).json({
                success: false,
                message: "Unable to log out."
            });

        }

        res.clearCookie("connect.sid");

        res.json({
            success: true,
            message: "Logged out successfully."
        });

    });

});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {

    console.log(`KROOZ'IN server running on port ${PORT}`);

});