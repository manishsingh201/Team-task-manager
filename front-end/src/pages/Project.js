import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProjectView() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Clean API URL to prevent double slashes
  const API_URL = (process.env.REACT_APP_API_URL || "https://team-task-manager-q0l9.onrender.com").replace(/\/$/, "");

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/projects`);
      setProjects(res.data);
    } catch (err) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newProject.trim()) return toast.warn("Project name is required");

    try {
      await axios.post(`${API_URL}/api/projects/add`, { name: newProject });
      toast.success("Project Created! 📂");
      setNewProject("");
      fetchProjects();
    } catch (err) {
      toast.error("Error creating project");
    }
  };

  const handleDelete = async (id) => {
    if (!id) return toast.error("Invalid ID");

    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        // Construct clean URL: BaseURL + Path + ID
        const finalUrl = `${API_URL}/api/projects/${id}`;
        
        console.log("Attempting DELETE at:", finalUrl);

        const response = await axios.delete(finalUrl);

        if (response.status === 200) {
          toast.info("Project Removed");
          // Remove from local state immediately
          setProjects(prev => prev.filter(p => p._id !== id));
        }
      } catch (err) {
        console.error("Delete failure details:", err.response?.data || err.message);
        toast.error(err.response?.data?.message || "Delete failed. Check console.");
      }
    }
  };

  if (loading) return <div style={loaderStyle}>Loading Projects...</div>;

  return (
    <div style={containerStyle}>
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
      
      <h1 style={titleStyle}>Projects Library 📁</h1>

      <form onSubmit={handleCreate} style={formStyle}>
        <input
          type="text"
          placeholder="New Project Name..."
          style={inputStyle}
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
        />
        <button type="submit" style={btnStyle}>
          Create Project
        </button>
      </form>

      <div style={gridStyle}>
        {projects.length === 0 ? (
          <p style={{color: '#64748b'}}>No projects available.</p>
        ) : (
          projects.map((proj) => (
            <div key={proj._id} style={cardStyle}>
              <div style={cardContent}>
                <span style={iconStyle}>📁</span>
                <h3 style={projNameStyle}>{proj.name}</h3>
              </div>
              <button onClick={() => handleDelete(proj._id)} style={delBtnStyle}>
                Remove Project
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// STYLES (Fixed Overlap logic included)
const containerStyle = { padding: "40px", background: "#f8fafc", minHeight: "100vh" };
const titleStyle = { fontSize: "32px", color: "#0f172a", marginBottom: "30px" };
const formStyle = { display: "flex", gap: "15px", flexWrap: "wrap", background: "white", padding: "25px", borderRadius: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", marginBottom: "40px", alignItems: "center" };
const inputStyle = { flex: "1 1 300px", minWidth: "250px", padding: "14px 20px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "16px" };
const btnStyle = { background: "#6366f1", color: "white", border: "none", padding: "14px 30px", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", whiteSpace: "nowrap", height: "50px" };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" };
const cardStyle = { background: "white", padding: "25px", borderRadius: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 10px 25px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9" };
const cardContent = { display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" };
const iconStyle = { fontSize: "24px" };
const projNameStyle = { margin: 0, fontSize: "18px", color: "#1e293b" };
const delBtnStyle = { background: "none", border: "1px solid #fecaca", color: "#ef4444", padding: "8px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "bold" };
const loaderStyle = { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px", fontWeight: "bold", color: "#64748b" };

export default ProjectView;