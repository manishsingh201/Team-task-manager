import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TeamView({ isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000"; 

  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      navigate("/");
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, [navigate]);

  const fetchAllData = useCallback(async () => {
    try {
      const [userRes, taskRes] = await Promise.all([
        axios.get(`${API_URL}/api/auth/users`),
        axios.get(`${API_URL}/api/tasks`)
      ]);
      setUsers(userRes.data || []);
      setTasks(taskRes.data || []);
    } catch (err) {
      console.error("Sync Error:", err);
    }
  }, [API_URL]);

  useEffect(() => {
    if (user) fetchAllData();
  }, [fetchAllData, user]);

  const handleRemoveMember = async (id, name) => {
    if (window.confirm(`Remove ${name} from team?`)) {
      try {
        await axios.delete(`${API_URL}/api/auth/users/${id}`);
        toast.success(`${name} removed`);
        fetchAllData();
      } catch (err) {
        toast.error("Error removing member");
      }
    }
  };

  const getUserStats = (email) => {
    const userTasks = tasks.filter((t) => t.assignedTo === email) || [];
    const total = userTasks.length;
    const completed = userTasks.filter((t) => t.status === "Completed").length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
  };

  if (!user) return <div style={{color: "black", padding: "50px"}}>Loading User...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Inter', sans-serif" }}>
      <ToastContainer position="top-right" autoClose={2000} />
      
      {/* PROFESSIONAL HEADER */}
      <header style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
           <h2 style={{ margin: 0, color: "#1e293b", fontSize: "24px" }}>Team Directory</h2>
           <span style={memberCountBadge}>{users.length} Members</span>
        </div>
        <div style={userAvatarStyle}>
          {user.name[0].toUpperCase()}
        </div>
      </header>

      <div style={containerStyle}>
        <div style={gridStyle}>
          {users.length > 0 ? (
            users.map((u) => {
              const stats = getUserStats(u.email);
              return (
                <div key={u._id} style={modernCard}>
                  {/* DELETE BUTTON */}
                  {user.role === "Admin" && u._id !== user._id && (
                    <button 
                      onClick={() => handleRemoveMember(u._id, u.name)} 
                      style={deleteBtnStyle}
                    >
                      ✕
                    </button>
                  )}

                  {/* USER INFO */}
                  <div style={cardProfileSection}>
                    <div style={initialsCircle}>{u.name[0].toUpperCase()}</div>
                    <h3 style={nameText}>{u.name}</h3>
                    <p style={emailText}>{u.email}</p>
                    <span style={roleBadge(u.role)}>{u.role}</span>
                  </div>

                  {/* STATS SECTION */}
                  <div style={statsGrid}>
                    <div style={statItem}>
                      <span style={statLabel}>Total</span>
                      <span style={statValue}>{stats.total}</span>
                    </div>
                    <div style={statItem}>
                      <span style={statLabel}>Done</span>
                      <span style={{...statValue, color: "#10b981"}}>{stats.completed}</span>
                    </div>
                    <div style={statItem}>
                      <span style={statLabel}>Progress</span>
                      <span style={statValue}>{stats.percent}%</span>
                    </div>
                  </div>

                  {/* PROGRESS BAR */}
                  <div style={progressBarBg}>
                    <div style={{
                      ...progressBarFill, 
                      width: `${stats.percent}%`,
                      background: stats.percent > 70 ? "#10b981" : stats.percent > 40 ? "#f59e0b" : "#ef4444"
                    }}></div>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ textAlign: "center", gridColumn: "1/-1", color: "#64748b" }}>
         NO REGISTERED MEMBERS RIGHT NOW
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// STYLES - Logic Se Alag Rakhe Hain
const headerStyle = {
  padding: "15px 40px",
  background: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
};

const memberCountBadge = {
  background: "#e2e8f0",
  padding: "4px 10px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "bold",
  color: "#475569"
};

const userAvatarStyle = {
  background: "#6366f1",
  color: "white",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.4)"
};

const containerStyle = { padding: "40px" };

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "25px"
};

const modernCard = {
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
  position: "relative",
  textAlign: "center",
  border: "1px solid #f1f5f9"
};

const deleteBtnStyle = {
  position: "absolute",
  right: "12px",
  top: "12px",
  background: "#fee2e2",
  color: "#ef4444",
  border: "none",
  width: "24px",
  height: "24px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "0.2s"
};

const cardProfileSection = { marginBottom: "20px" };

const initialsCircle = {
  width: "60px",
  height: "60px",
  background: "#f1f5f9",
  color: "#6366f1",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 15px",
  fontSize: "22px",
  fontWeight: "bold"
};

const nameText = { margin: "0 0 4px 0", color: "#1e293b", fontSize: "18px" };
const emailText = { margin: "0 0 12px 0", color: "#64748b", fontSize: "13px" };

const roleBadge = (role) => ({
  fontSize: "11px",
  padding: "3px 10px",
  borderRadius: "20px",
  background: role === "Admin" ? "#fff1f2" : "#f0f9ff",
  color: role === "Admin" ? "#e11d48" : "#0369a1",
  fontWeight: "bold",
  textTransform: "uppercase"
});

const statsGrid = {
  display: "flex",
  justifyContent: "space-between",
  padding: "15px 0",
  borderTop: "1px solid #f1f5f9",
  marginTop: "10px"
};

const statItem = { display: "flex", flexDirection: "column" };
const statLabel = { fontSize: "10px", color: "#94a3b8", textTransform: "uppercase" };
const statValue = { fontSize: "15px", fontWeight: "bold", color: "#1e293b" };

const progressBarBg = { height: "6px", background: "#f1f5f9", borderRadius: "10px", overflow: "hidden", marginTop: "10px" };
const progressBarFill = { height: "100%", transition: "width 0.5s ease-in-out" };

export default TeamView;