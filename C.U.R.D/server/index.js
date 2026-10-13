import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/curd-app";

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please enter a valid email address."],
      unique: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

app.get("/", (_req, res) => {
  res.json({ message: "Express backend is running!" });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.get("/api/users", async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});

app.post("/api/users", async (req, res) => {
  const user = await User.create({
    name: req.body?.name,
    email: req.body?.email,
  });
  res.status(201).json(user);
});

app.put("/api/users/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name: req.body?.name, email: req.body?.email },
    { new: true, runValidators: true },
  );

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  res.json(user);
});

app.delete("/api/users/:id", async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  res.status(204).end();
});

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((error, _req, res, _next) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ message: error.message });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: "A user with this information already exists." });
  }

  console.error("Request failed:", error);
  res.status(500).json({ message: "An unexpected server error occurred." });
});

try {
  await mongoose.connect(MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("Unable to connect to MongoDB:", error);
  process.exitCode = 1;
}
