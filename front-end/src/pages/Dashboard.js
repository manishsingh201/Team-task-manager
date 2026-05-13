import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function Dashboard({ isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "https://team-task-manager-q0l9.onrender.com";

  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState([]);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [user, setUser] = useState(null);

  const [showMenu, setShowMenu] =
    useState(false);

  const menuRef = useRef();

  // SESSION CHECK
  useEffect(() => {
    const savedUser =
      localStorage.getItem("user");

    if (!savedUser) {
      navigate("/");
    } else {
      setUser(JSON.parse(savedUser));
    }

    const closeMenu = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      closeMenu
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        closeMenu
      );
  }, [navigate]);

  // FETCH DATA
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [taskRes, teamRes, projRes] =
        await Promise.all([
          axios.get(
            `${API_URL}/api/tasks`
          ),

          axios.get(
            `${API_URL}/api/auth/users`
          ),

          axios.get(
            `${API_URL}/api/projects`
          ),
        ]);

      setTasks(taskRes.data);
      setTeam(teamRes.data);
      setProjects(projRes.data);

    } catch (err) {
      toast.error("Sync failed!");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

  // LOGOUT
  const handleLogout = () => {
    localStorage.clear();

    toast.info("Logging out...");

    navigate("/");
  };

  // ADD TASK
  const handleAddTask = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const taskData = {
      title: formData.get("title"),
      projectName:
        formData.get("projectName"),
      assignedTo:
        formData.get("assignedTo"),
      deadline: formData.get("deadline"),
      priority: formData.get("priority"),
    };

    if (
      !taskData.title ||
      !taskData.assignedTo ||
      !taskData.projectName
    ) {
      return toast.warn(
        "Please fill all fields"
      );
    }

    try {
      await axios.post(
        `${API_URL}/api/tasks/add`,
        taskData
      );

      toast.success(
        "Task Assigned Successfully 🚀"
      );

      e.target.reset();

      fetchData();

    } catch (err) {
      toast.error("Failed to add task");
    }
  };

  // COMPLETE TASK
  const handleUpdateStatus = async (
    id
  ) => {
    try {
      await axios.put(
        `${API_URL}/api/tasks/${id}`,
        {
          status: "Completed",
        }
      );

      toast.success("Task Completed 🎉");

      fetchData();

    } catch (err) {
      toast.error("Update failed");
    }
  };

  // DELETE TASK
  const handleDelete = async (id) => {
    if (window.confirm("Delete task?")) {
      try {
        await axios.delete(
          `${API_URL}/api/tasks/${id}`
        );

        toast.info("Task Deleted");

        fetchData();

      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  // LOADER
  if (loading) {
    return (
      <div style={loaderStyle}>
        Loading Dashboard...
      </div>
    );
  }

  if (!user) return null;

  // TASK FILTER
  const displayTasks =
    user.role === "Admin"
      ? tasks
      : tasks.filter(
          (t) =>
            t.assignedTo === user.email
        );

  const filteredTasks =
    displayTasks.filter((t) =>
      t.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  const getAssignedName = (email) => {
    const member = team.find((m) => m.email === email);
    return member?.name || email;
  };

  // PIE CHART DATA
  const priorityData = [
    {
      name: "High",
      value: displayTasks.filter(
        (t) => t.priority === "High"
      ).length,
      color: "#ef4444",
    },

    {
      name: "Medium",
      value: displayTasks.filter(
        (t) =>
          t.priority === "Medium" ||
          !t.priority
      ).length,
      color: "#f59e0b",
    },

    {
      name: "Low",
      value: displayTasks.filter(
        (t) => t.priority === "Low"
      ).length,
      color: "#3b82f6",
    },
  ].filter((d) => d.value > 0);

  return (
    <>
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
            gap: "15px",
          }}
        >
          <button
            onClick={() =>
              setIsCollapsed(!isCollapsed)
            }
            style={iconBtnStyle}
          >
            ☰
          </button>

          <div>
            <h1 style={titleStyle}>
              Welcome, {user.name} 👋
            </h1>

            <p style={subTitleStyle}>
              Role:
              <b
                style={{
                  color: "#6366f1",
                }}
              >
                {" "}
                {user.role}
              </b>
            </p>
          </div>
        </div>

        <div style={topRightStyle}>
          <input
            type="text"
            placeholder="Search tasks..."
            style={searchInputStyle}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />

          <div
            style={{
              position: "relative",
            }}
            ref={menuRef}
          >
            <div
              style={userCircleStyle}
              onClick={() =>
                setShowMenu(!showMenu)
              }
            >
              {user.name[0]}
            </div>

            {showMenu && (
              <div style={dropdownStyle}>
                <div
                  style={{
                    padding: "15px",
                    borderBottom:
                      "1px solid #e2e8f0",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontWeight: "bold",
                    }}
                  >
                    {user.name}
                  </p>

                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      color: "#64748b",
                    }}
                  >
                    {user.email}
                  </p>
                </div>

                <div
                  style={logoutItemStyle}
                  onClick={handleLogout}
                >
                  🚪 Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div style={mainContentStyle}>

        {/* STATS */}
        <div style={statsRowStyle}>

          <div style={statsColumnStyle}>
            <div
              style={statBoxStyle(
                "#6366f1"
              )}
            >
              <span>Total Tasks</span>

              <h2>
                {displayTasks.length}
              </h2>
            </div>

            <div
              style={statBoxStyle(
                "#f59e0b"
              )}
            >
              <span>Pending</span>

              <h2>
                {
                  displayTasks.filter(
                    (t) =>
                      t.status ===
                      "Pending"
                  ).length
                }
              </h2>
            </div>

            <div
              style={statBoxStyle(
                "#10b981"
              )}
            >
              <span>Completed</span>

              <h2>
                {
                  displayTasks.filter(
                    (t) =>
                      t.status ===
                      "Completed"
                  ).length
                }
              </h2>
            </div>
          </div>

          {/* CHART */}
          <div style={chartCardStyle}>
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  margin: 0,
                  color: "#0f172a",
                }}
              >
                Priority Analysis
              </h2>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                Tasks by urgency
              </p>
            </div>

            <div
              style={{
                flex: 1,
                height: "220px",
              }}
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={priorityData}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {priorityData.map(
                      (
                        entry,
                        index
                      ) => (
                        <Cell
                          key={index}
                          fill={
                            entry.color
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />

                  <Legend
                    verticalAlign="middle"
                    align="right"
                    layout="vertical"
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ADMIN PANEL */}
        {user.role === "Admin" && (
          <div style={adminPanelStyle}>
            <h2
              style={{
                marginTop: 0,
                marginBottom: "20px",
              }}
            >
              Assign New Task
            </h2>

            <form
              onSubmit={handleAddTask}
              style={formStyle}
            >
              <input
                name="title"
                placeholder="Task Title"
                required
                style={inputStyle}
              />

              <select
                name="projectName"
                required
                style={inputStyle}
              >
                <option value="">
                  Select Project
                </option>

                {projects.map((proj) => (
                  <option
                    key={proj._id}
                    value={proj.name}
                  >
                    {proj.name}
                  </option>
                ))}
              </select>

              <select
                name="assignedTo"
                required
                style={inputStyle}
              >
                <option value="">
                  Assign Member
                </option>

                {team.map((m) => (
                  <option
                    key={m._id}
                    value={m.email}
                  >
                    {m.name}
                  </option>
                ))}
              </select>

              <select
                name="priority"
                style={inputStyle}
              >
                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

                <option value="Low">
                  Low
                </option>
              </select>

              <input
                name="deadline"
                type="date"
                required
                style={inputStyle}
              />

              <button
                type="submit"
                style={addBtnStyle}
              >
                Add Task
              </button>
            </form>
          </div>
        )}

        {/* TASK GRID */}
        <div style={taskGridStyle}>
          {filteredTasks.map((task) => {
            const isOverdue =
              new Date(task.deadline) <
                new Date().setHours(
                  0,
                  0,
                  0,
                  0
                ) &&
              task.status !==
                "Completed";

            const pColor =
              task.priority === "High"
                ? "#ef4444"
                : task.priority ===
                  "Low"
                ? "#3b82f6"
                : "#f59e0b";

            return (
              <div
                key={task._id}
                style={{
                  ...taskCardStyle,
                  borderTop: `6px solid ${pColor}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={badgeStyle(
                      task.status
                    )}
                  >
                    {task.status}
                  </span>

                  <span
                    style={
                      projectBadgeStyle
                    }
                  >
                    📁{" "}
                    {task.projectName ||
                      "General"}
                  </span>
                </div>

                <h3 style={taskTitleStyle}>
                  {task.title}
                </h3>

                <p style={taskTextStyle}>
                  Assigned To:
                  <b>
                    {" "}
                    {getAssignedName(task.assignedTo)}
                  </b>
                </p>

                <div style={footerStyle}>
                  <div>
                    <span
                      style={
                        deadlineLabelStyle
                      }
                    >
                      DEADLINE
                    </span>

                    <div
                      style={{
                        fontWeight:
                          "bold",

                        color: isOverdue
                          ? "#ef4444"
                          : "#0f172a",
                      }}
                    >
                      {new Date(
                        task.deadline
                      ).toLocaleDateString()}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    {user.role ===
                      "Member" &&
                      task.status ===
                        "Pending" && (
                        <button
                          style={actionBtn(
                            "#10b981"
                          )}
                          onClick={() =>
                            handleUpdateStatus(
                              task._id
                            )
                          }
                        >
                          Done
                        </button>
                      )}

                    {user.role ===
                      "Admin" && (
                      <button
                        style={actionBtn(
                          "#ef4444"
                        )}
                        onClick={() =>
                          handleDelete(
                            task._id
                          )
                        }
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {isOverdue && (
                  <div
                    style={overdueRibbon}
                  >
                    OVERDUE
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// STYLES

const loaderStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "22px",
  fontWeight: "bold",
  background: "#f8fafc",
};

const headerStyle = {
  height: "90px",
  background: "white",
  borderBottom: "1px solid #e2e8f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 30px",
  marginBottom: "20px",
};

const iconBtnStyle = {
  background: "none",
  border: "none",
  fontSize: "28px",
  cursor: "pointer",
  color: "#0f172a",
  padding: "8px",
  borderRadius: "12px",
  transition: "background 0.2s ease",
};

const titleStyle = {
  margin: 0,
  fontSize: "32px",
  color: "#0f172a",
};

const subTitleStyle = {
  margin: 0,
  color: "#64748b",
  fontSize: "14px",
};

const topRightStyle = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
};

const searchInputStyle = {
  padding: "12px 20px",
  borderRadius: "30px",
  border: "1px solid #e2e8f0",
  outline: "none",
  width: "260px",
};

const userCircleStyle = {
  width: "46px",
  height: "46px",
  borderRadius: "50%",
  background: "#6366f1",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  cursor: "pointer",
};

const dropdownStyle = {
  position: "absolute",
  top: "60px",
  right: 0,
  width: "220px",
  background: "white",
  borderRadius: "14px",
  overflow: "hidden",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.1)",
  zIndex: 100,
};

const logoutItemStyle = {
  padding: "14px",
  textAlign: "center",
  color: "#ef4444",
  fontWeight: "bold",
  cursor: "pointer",
};

const mainContentStyle = {
  padding: "30px",
  background: "#f8fafc",
  minHeight: "100vh",
};

const statsRowStyle = {
  display: "flex",
  gap: "30px",
  flexWrap: "wrap",
  marginBottom: "35px",
};

const statsColumnStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  minWidth: "260px",
};

const statBoxStyle = (color) => ({
  background: "white",
  padding: "20px 25px",
  borderRadius: "20px",
  borderLeft: `6px solid ${color}`,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const chartCardStyle = {
  flex: 2,
  background: "white",
  borderRadius: "25px",
  padding: "30px",
  display: "flex",
  alignItems: "center",
  minWidth: "340px",
  boxShadow: "0 15px 40px rgba(15, 23, 42, 0.08)",
};

const adminPanelStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "25px",
  marginBottom: "35px",
};

const formStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const inputStyle = {
  flex: "1 1 180px",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  outline: "none",
};

const addBtnStyle = {
  background: "#6366f1",
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: "14px 25px",
  cursor: "pointer",
  fontWeight: "bold",
};

const taskGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fill,minmax(320px,1fr))",
  gap: "25px",
};

const taskCardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "22px",
  boxShadow:
    "0 8px 25px rgba(0,0,0,0.05)",
  position: "relative",
  overflow: "hidden",
};

const badgeStyle = (status) => ({
  background:
    status === "Completed"
      ? "#dcfce7"
      : "#fff7ed",

  color:
    status === "Completed"
      ? "#166534"
      : "#c2410c",

  padding: "5px 14px",
  borderRadius: "30px",
  fontSize: "11px",
  fontWeight: "bold",
});

const projectBadgeStyle = {
  color: "#6366f1",
  fontSize: "11px",
  fontWeight: "bold",
  background: "#eef2ff",
  padding: "4px 10px",
  borderRadius: "10px",
};

const taskTitleStyle = {
  margin: "10px 0 5px",
  color: "#0f172a",
};

const taskTextStyle = {
  fontSize: "13px",
  color: "#64748b",
};

const footerStyle = {
  marginTop: "20px",
  borderTop: "1px solid #f1f5f9",
  paddingTop: "15px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const deadlineLabelStyle = {
  fontSize: "11px",
  color: "#94a3b8",
};

const actionBtn = (color) => ({
  border: `1px solid ${color}`,
  color,
  background: "none",
  borderRadius: "10px",
  padding: "8px 14px",
  cursor: "pointer",
  fontWeight: "bold",
});

const overdueRibbon = {
  position: "absolute",
  top: "12px",
  right: "-35px",
  background: "#ef4444",
  color: "white",
  padding: "5px 40px",
  transform: "rotate(45deg)",
  fontSize: "10px",
  fontWeight: "bold",
};

export default Dashboard;