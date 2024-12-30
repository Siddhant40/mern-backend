const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const UserModel = require("./model/userModel.js");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the .env file");
}

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("DB Connected successfully");
        app.listen(PORT, () => {
            console.log(`Server running at ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection error:", error);
        process.exit(1);    
    });

app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log("Request Body:", req.body); // Debugging the incoming data

        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await UserModel.findOne({ email });
        console.log("Existing User:", existingUser);

        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword });
        const savedUser = await newUser.save();

        res.status(201).json({ message: "Signup successful", user: savedUser });
    } catch (error) {
        console.error("Error during signup:", error.message);
        res.status(500).json({ error: error.message });
    }
});
