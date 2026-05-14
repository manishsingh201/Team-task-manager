const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Task = require("../models/Task"); 

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

// 3. DELETE PROJECT & LINKED TASKS (Cascading Delete)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);
    
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Clean up all tasks that belonged to this project
    await Task.deleteMany({ projectId: id });
    
    res.status(200).json({ message: "Project and tasks deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;