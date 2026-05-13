const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// 1. GET ALL PROJECTS - Saare projects lane ke liye
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. CREATE PROJECT - Naya project add karne ke liye
router.post("/add", async (req, res) => {
  try {
    const newProject = new Project({ name: req.body.name });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    // Unique name constraint check
    res.status(400).json({ error: "Project already exists or invalid data" });
  }
});

// 3. DELETE PROJECT - Project remove karne ke liye (Added for safety)
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;