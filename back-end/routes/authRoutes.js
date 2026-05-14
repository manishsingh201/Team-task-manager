const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

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

// 3. DELETE PROJECT - This matches app.use("/api/projects", projectRoutes)
router.delete("/:id", async (req, res) => {
  // This log will show up in your Render "Logs" tab
  console.log("Delete request received for Project ID:", req.params.id);
  
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found in database" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;