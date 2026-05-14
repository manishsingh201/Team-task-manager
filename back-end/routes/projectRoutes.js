const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// GET ALL
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post("/add", async (req, res) => {
  try {
    const newProject = new Project({ name: req.body.name });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ error: "Project already exists" });
  }
});

// DELETE - Fixed Route
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);
    
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found in database" });
    }
    
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;