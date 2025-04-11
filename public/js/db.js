const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",      // Default MySQL user in XAMPP
    password: "",      // Leave blank if no password set
    database: "bank_project"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL Database");
    }
});

module.exports = db;
