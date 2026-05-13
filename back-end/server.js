const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ROUTES IMPORT
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes"); 
const projectRoutes = require("./routes/projectRoutes");

// MIDDLEWARE (Route se pehle hona zaroori hai)
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// API ROUTES
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

app.get("/", (req, res) => {
  res.send("API Running Successfully");
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});