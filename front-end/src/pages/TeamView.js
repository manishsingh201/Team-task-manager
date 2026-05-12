import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TeamView({ isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  // SESSION CHECK
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      navigate("/");
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, [navigate]);

  // FETCH USERS & TASKS
  const fetchAllData = async () => {
    try {
      const [userRes, taskRes] = await Promise.all([
        axios.get("http://localhost:5000/api/auth/users"),
        axios.get("http://localhost:5000/api/tasks")
      ]);

      setUsers(userRes.data);
      setTasks(taskRes.data);

    } catch (err) {
      console.error(err);
      toast.error("Failed to sync team data");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // REMOVE MEMBER
  const handleRemoveMember = async (id, name) => {
    if (window.confirm(`Remove ${name} from team?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/auth/users/${id}`);

        toast.success(`${name} removed`);
        fetchAllData();

      } catch (err) {
        toast.error("Error removing member");
      }
    }
  };

  // USER STATS
  const getUserStats = (email) => {
    const userTasks = tasks.filter(
      (t) => t.assignedTo === email
    );

    const total = userTasks.length;

    const completed = userTasks.filter(
      (t) => t.status === "Completed"
    ).length;

    const percent =
      total > 0
        ? Math.round((completed / total) * 100)
        : 0;

    return { total, completed, percent };
  };

  if (!user) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="colored"
      />

      {/* TOP NAVBAR */}
      <header
        style={{
          height: "80px",
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 30px",
          borderBottom: "1px solid #e2e8f0"
        }}
      >
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
            <h1
              style={{
                margin: 0,
                fontSize: "28px",
                color: "#1e293b"
              }}
            >
              Team Management
            </h1>

            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#64748b"
              }}
            >
              Monitor performance and manage roles
            </p>
          </div>
        </div>

        <div style={userCircleStyle}>
          {user.name[0].toUpperCase()}
        </div>
      </header>

      {/* CONTENT */}
      <div
        style={{
          padding: "35px"
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "25px"
          }}
        >
          {users.length > 0 ? (
            users.map((u) => {
              const stats = getUserStats(u.email);

              return (
                <div key={u._id} style={cardStyle}>

                  {/* REMOVE BUTTON */}
                  {user.role === "Admin" &&
                    u._id !== user._id && (
                      <button
                        onClick={() =>
                          handleRemoveMember(
                            u._id,
                            u.name
                          )
                        }
                        style={removeBtnStyle}
                      >
                        Remove
                      </button>
                    )}

                  {/* AVATAR */}
                  <div style={avatarStyle}>
                    {u.name
                      ? u.name[0].toUpperCase()
                      : "U"}
                  </div>

                  {/* NAME */}
                  <h3
                    style={{
                      marginBottom: "4px",
                      color: "#1e293b"
                    }}
                  >
                    {u.name}
                  </h3>

                  {/* EMAIL */}
                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "13px",
                      marginBottom: "15px"
                    }}
                  >
                    {u.email}
                  </p>

                  {/* ROLE */}
                  <span style={roleBadgeStyle(u.role)}>
                    {u.role}
                  </span>

                  {/* STATS */}
                  <div style={statsContainerStyle}>
                    <div style={{ flex: 1 }}>
                      <p style={statsLabel}>TASKS</p>
                      <p style={statsValue}>
                        {stats.total}
                      </p>
                    </div>

                    <div
                      style={{
                        flex: 1,
                        borderLeft:
                          "1px solid #f1f5f9",
                        borderRight:
                          "1px solid #f1f5f9"
                      }}
                    >
                      <p style={statsLabel}>DONE</p>

                      <p
                        style={{
                          ...statsValue,
                          color: "#10b981"
                        }}
                      >
                        {stats.completed}
                      </p>
                    </div>

                    <div style={{ flex: 1 }}>
                      <p style={statsLabel}>
                        EFFICIENCY
                      </p>

                      <p style={statsValue}>
                        {stats.percent}%
                      </p>
                    </div>
                  </div>

                  {/* PROGRESS */}
                  <div style={progressBg}>
                    <div
                      style={{
                        ...progressFill,
                        width: `${stats.percent}%`
                      }}
                    ></div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Loading team members...</p>
          )}
        </div>
      </div>
    </div>
  );
}

// STYLES

const headerToggleBtnStyle = {
  background: "none",
  border: "none",
  fontSize: "24px",
  cursor: "pointer",
};

const userCircleStyle = {
  width: "42px",
  height: "42px",
  background: "#6366f1",
  color: "white",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold"
};

const cardStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "22px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  textAlign: "center",
  position: "relative",
  overflow: "hidden"
};

const avatarStyle = {
  width: "65px",
  height: "65px",
  background:
    "linear-gradient(135deg,#6366f1,#8b5cf6)",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 15px",
  color: "white",
  fontSize: "22px",
  fontWeight: "bold",
  boxShadow:
    "0 5px 15px rgba(99,102,241,0.3)"
};

const roleBadgeStyle = (role) => ({
  fontSize: "11px",
  fontWeight: "bold",
  padding: "5px 12px",
  borderRadius: "20px",
  background:
    role === "Admin"
      ? "#fff1f2"
      : "#eff6ff",
  color:
    role === "Admin"
      ? "#e11d48"
      : "#2563eb",
  textTransform: "uppercase"
});

const removeBtnStyle = {
  position: "absolute",
  top: "15px",
  right: "15px",
  background: "none",
  border: "1px solid #fda4af",
  color: "#e11d48",
  padding: "4px 10px",
  borderRadius: "6px",
  fontSize: "11px",
  cursor: "pointer",
  fontWeight: "bold"
};

const statsContainerStyle = {
  display: "flex",
  marginTop: "25px",
  paddingTop: "15px",
  borderTop: "1px solid #f1f5f9"
};

const statsLabel = {
  margin: 0,
  fontSize: "10px",
  color: "#94a3b8",
  fontWeight: "bold"
};

const statsValue = {
  margin: "5px 0 0",
  fontSize: "16px",
  fontWeight: "bold",
  color: "#1e293b"
};

const progressBg = {
  height: "6px",
  background: "#f1f5f9",
  borderRadius: "10px",
  marginTop: "15px",
  overflow: "hidden"
};

const progressFill = {
  height: "100%",
  background: "#6366f1",
  transition: "width 0.5s ease"
};

export default TeamView;