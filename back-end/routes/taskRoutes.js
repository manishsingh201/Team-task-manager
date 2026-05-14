const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// 1. CREATE TASK
router.post("/add", async (req, res) => {
  try {
    // Ensure the body includes 'projectId' (the ID, not the name string)
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. GET ALL TASKS
router.get("/", async (req, res) => {
  try {
    const { projectId } = req.query;
    let query = {};
    
    // If a specific project is selected in UI, filter tasks by that ID
    if (projectId) {
      query = { projectId: projectId };
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. DELETE TASK
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. UPDATE TASK STATUS
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;