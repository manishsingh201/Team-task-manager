const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  // Task ko kisi specific project se jodne ke liye
  projectName: {
    type: String,
    default: "General", // Default "General" project
  },
  // Kis member ko kaam dena hai, uska email yahan aayega
  assignedTo: {
    type: String,
    required: true,
  },
  // Task kab tak khatam hona chahiye (Overdue logic ke liye zaroori hai)
  deadline: {
    type: Date,
    required: true,
  },
  // Priority logic (High/Medium/Low) - isse filtering asan hoti hai
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium"
  },
  status: {
    type: String,
    enum: ["Pending", "Completed"], // Sirf ye do status valid hain
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", taskSchema);