
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Express backend is running!" });
});

// API route
app.get("/api/users", (req, res) => {
  res.json([
    { id: 1, name: "Rahul" },
    { id: 2, name: "Amit" },
    { id: 3, name: "Vaibhaw" }
  ]);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
