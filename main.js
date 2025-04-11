// Import Libraries
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

// Import middleware
const authMiddleware = require("./middlewares/authMiddleware.js");

// Import Routes
const accountRoutes = require("./routes/accountRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");
const transactionRoutes = require("./routes/transactionRoutes.js");

const PORT = 3000;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Middleware
app.use(session({
	secret: "yourSecretKey", // Replace with a strong secret key
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }, // Set to true in production with HTTPS
}));

// CORS Configuration
app.use(cors({
	origin: "http://localhost:3000", // Update if frontend is on a different port
	methods: ["GET", "POST", "PUT", "DELETE"],
	credentials: true,
}));

// Serve Static Files
app.use(express.static(path.join(__dirname, "public"))); // Ensures correct path
app.set("view engine", "ejs");

// Routes
app.use("/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Index Route → Redirect to Dashboard
app.get("/", (_req, res) => {
	res.redirect("/dashboard");
});

// Login Page
app.get("/login", (_req, res) => {
	res.render("login");
});

// Register Page
app.get("/register", (_req, res) => {
	res.render("register");
});

// Protected Routes (After Authentication)
app.use(authMiddleware);

app.get("/dashboard", (req, res) => {
	if (!req.session.user) {
		return res.redirect("/login");
	}
	res.render("dashboard", { user: req.session.user.username });
});

app.get("/transfer", (req, res) => {
	if (!req.session.user) {
		return res.redirect("/login");
	}
	res.render("transfer", { user: req.session.user.username });
});

// Start Server
app.listen(PORT, () => {
	console.log(`✅ Server is running on http://localhost:${PORT}`);
});
