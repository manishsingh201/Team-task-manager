const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Task = require("../models/Task"); // Import Task to clean up orphans

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

// 3. DELETE PROJECT & LINKED TASKS
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Delete request received for Project ID:", id);
  
  try {
    // Delete the project
    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found in database" });
    }

    // CASCADE DELETE: Remove all tasks associated with this project
    // This prevents "Sync Failed" errors on the Dashboard
    await Task.deleteMany({ projectId: id });
    
    res.json({ message: "Project and associated tasks deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;