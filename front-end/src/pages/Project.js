import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Projects({ isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);

  const [showProjInput, setShowProjInput] = useState(false);
  const [newProjName, setNewProjName] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      navigate("/");
    } else {
      setUser(JSON.parse(savedUser));
    }

    fetchInitialData();
  }, [navigate]);

  // FETCH DATA
  const fetchInitialData = async () => {
    try {
      const [taskRes, projRes] = await Promise.all([
        axios.get("http://localhost:5000/api/tasks"),
        axios.get("http://localhost:5000/api/projects"),
      ]);

      setTasks(taskRes.data);
      setProjects(projRes.data);

    } catch (err) {
      console.error(err);
      toast.error("Unable to synchronize data");
    }
  };

  // CREATE PROJECT
  const handleCreateProject = async () => {
    if (!newProjName.trim()) {
      return toast.warn("Project name required");
    }

    try {
      await axios.post(
        "http://localhost:5000/api/projects/add",
        {
          name: newProjName,
        }
      );

      toast.success("Project created successfully");

      setNewProjName("");
      setShowProjInput(false);

      fetchInitialData();

    } catch (err) {
      toast.error("Failed to create project");
    }
  };

  // PROJECT STATS
  const getProjectStats = (pName) => {
    const pTasks = tasks.filter(
      (t) => t.projectName === pName
    );

    if (pTasks.length === 0) {
      return {
        total: 0,
        progress: 0,
      };
    }

    const completed = pTasks.filter(
      (t) => t.status === "Completed"
    ).length;

    return {
      total: pTasks.length,
      progress: Math.round(
        (completed / pTasks.length) * 100
      ),
    };
  };

  if (!user) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="colored"
      />

      {/* HEADER */}
      <header style={headerStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px"
          }}
        >
          <button
            style={headerToggleBtnStyle}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            ☰
          </button>

          <div>
            <h1 style={titleStyle}>
              Project Portfolio
            </h1>

            <p style={subtitleStyle}>
              Manage projects and monitor progress
            </p>
          </div>
        </div>

        {user.role === "Admin" && (
          <button
            onClick={() =>
              setShowProjInput(!showProjInput)
            }
            style={createBtnStyle}
          >
            {showProjInput
              ? "Cancel"
              : "+ Create New Project"}
          </button>
        )}
      </header>

      {/* PAGE CONTENT */}
      <div
        style={{
          padding: "35px",
        }}
      >

        {/* CREATE FORM */}
        {showProjInput && (
          <div style={inlineFormStyle}>

            <div
              style={{
                flex: "1 1 300px",
              }}
            >
              <label style={labelStyle}>
                Project Name
              </label>

              <input
                value={newProjName}
                onChange={(e) =>
                  setNewProjName(
                    e.target.value
                  )
                }
                placeholder="Enter project name..."
                style={inputStyle}
              />
            </div>

            <button
              onClick={handleCreateProject}
              style={saveBtnStyle}
            >
              Create
            </button>
          </div>
        )}

        {/* PROJECT LIST */}
        <div
          style={{
            display: "grid",
            gap: "25px",
          }}
        >
          {projects.length > 0 ? (
            projects.map((p) => {
              const stats =
                getProjectStats(p.name);

              return (
                <div
                  key={p._id}
                  style={projectCardStyle}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      marginBottom: "18px",
                      flexWrap: "wrap",
                      gap: "15px",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "24px",
                          color: "#1e293b",
                        }}
                      >
                        {p.name}
                      </h3>

                      <p
                        style={{
                          marginTop: "6px",
                          color: "#64748b",
                        }}
                      >
                        Total Tasks:{" "}
                        <b>{stats.total}</b>
                      </p>
                    </div>

                    <span
                      style={
                        progressBadgeStyle
                      }
                    >
                      {stats.progress}%
                      Complete
                    </span>
                  </div>

                  {/* PROGRESS BAR */}
                  <div style={progressBg}>
                    <div
                      style={{
                        ...progressFill,
                        width: `${stats.progress}%`,
                        background:
                          stats.progress === 100
                            ? "#10b981"
                            : "linear-gradient(90deg,#6366f1,#a855f7)",
                      }}
                    ></div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={emptyStyle}>
              <h3>
                No Projects Available
              </h3>

              <p>
                {user.role === "Admin"
                  ? "Create your first project."
                  : "Waiting for admin to assign projects."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// STYLES

const headerStyle = {
  height: "90px",
  background: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 35px",
  borderBottom: "1px solid #e2e8f0",
};

const headerToggleBtnStyle = {
  background: "none",
  border: "none",
  fontSize: "24px",
  cursor: "pointer",
};

const titleStyle = {
  margin: 0,
  fontSize: "30px",
  color: "#1e293b",
  fontWeight: "800",
};

const subtitleStyle = {
  margin: "5px 0 0",
  color: "#64748b",
  fontSize: "14px",
};

const createBtnStyle = {
  background: "#6366f1",
  color: "white",
  border: "none",
  padding: "12px 24px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow:
    "0 4px 12px rgba(99,102,241,0.3)",
};

const inlineFormStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "20px",
  marginBottom: "35px",
  display: "flex",
  alignItems: "flex-end",
  gap: "20px",
  flexWrap: "wrap",
  boxShadow:
    "0 10px 25px rgba(0,0,0,0.05)",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "14px",
  fontWeight: "bold",
  color: "#475569",
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  outline: "none",
  fontSize: "15px",
};

const saveBtnStyle = {
  background: "#10b981",
  color: "white",
  border: "none",
  padding: "14px 30px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

const projectCardStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "22px",
  boxShadow:
    "0 4px 20px rgba(0,0,0,0.03)",
};

const progressBadgeStyle = {
  background: "#eef2ff",
  color: "#4f46e5",
  padding: "8px 16px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "bold",
};

const progressBg = {
  height: "14px",
  background: "#f1f5f9",
  borderRadius: "20px",
  overflow: "hidden",
};

const progressFill = {
  height: "100%",
  transition:
    "width 0.6s ease",
};

const emptyStyle = {
  textAlign: "center",
  background: "white",
  padding: "50px",
  borderRadius: "20px",
  color: "#64748b",
};

export default Projects;