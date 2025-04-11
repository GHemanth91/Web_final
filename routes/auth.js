const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./db"); // Import MySQL connection file

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handle Registration Form Submission
app.post("/register", async (req, res) => {
    const { fullName, email, phone, address, city, state, username, password, confirmPassword, accountType } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).send("Passwords do not match!");
    }

    // Hash password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into database
    const sql = "INSERT INTO users (fullName, email, phone, address, city, state, username, password, accountType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [fullName, email, phone, address, city, state, username, hashedPassword, accountType], (err, result) => {
        if (err) {
            console.error("❌ Registration Error:", err);
            return res.status(500).send("Error registering user.");
        }
        console.log("✅ User Registered Successfully!");
        res.redirect("/login");
    });
});
