const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  description: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  
});

// Ye line model banati hai jise hum routes mein use karte hain
module.exports = mongoose.model("Project", projectSchema);