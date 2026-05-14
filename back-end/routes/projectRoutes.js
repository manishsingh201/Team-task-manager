const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Task = require("../models/Task"); // Added this to handle associated tasks

// 1. GET ALL PROJECTS
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. CREATE PROJECT
router.post("/add", async (req, res) => {
  try {
    const newProject = new Project({ name: req.body.name });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ error: "Project already exists" });
  }
});

// 3. DELETE PROJECT & ASSOCIATED TASKS
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // First, find and delete the project
    const deletedProject = await Project.findByIdAndDelete(id);
    
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found in database" });
    }

    // CRITICAL FIX: Delete all tasks linked to this project ID
    // This prevents the "Sync Failed" error on the dashboard
    await Task.deleteMany({ projectId: id });
    
    console.log(`Deleted project ${id} and all its tasks.`);
    
    res.status(200).json({ message: "Project and associated tasks deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;