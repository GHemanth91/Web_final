const AccountModel = require("../models/accountModel.js").AccountModel;
const UserModel = require("../models/userModel.js").UserModel;

const authController = {
  register: async (req, res) => {
    console.log("Registering user...");
    console.log("Received form data:", req.body);
    try {
      const {
        fullName,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        username,
        password,
        accountType,
      } = req.body;

      // Validate input
      if (!fullName || !email || !password || !username) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Create user (which also creates the account inside userModel)
      const user = await UserModel.create({
        fullName,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        username,
        password,
        accountType,
      });

      console.log("User created:", user);

      // Return success response
      res.status(201).json({
        message: "Account created successfully",
        user: { id: user.id, username: user.username, email: user.email },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Server error during registration" });
    }
  },

  login: async (req, res) => {
    try {
      console.log("Logging in user...");
      const { username, password } = req.body;

      // Find user
      let user = await UserModel.findByUsername(username);
      if (!user) {
        user = await UserModel.findByEmail(username);
        if (!user) {
          return res.status(401).json({
            error: "Invalid Username or password",
          });
        }
      }
      console.log("User found:", user);

      // Simple password match (use hashing in production)
      if (user.password !== password) {
        console.log("Invalid password: ", user.password, password);
        return res.status(401).json({ error: "Invalid Password" });
      }

      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
      };

      console.log("Session ID:", req.session.id, "\nUser ID:", user.id);

      res.status(200).json({
        message: "Login successful",
        user: { id: user.id, username: user.username, email: user.email },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Server error during login" });
    }
  },

  logout: (req, res) => {
    // Destroy the session
    console.log(req.session);
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Server error during logout" });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
    console.log("Session destroyed");
  },
};

module.exports = { authController };
