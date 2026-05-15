import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://team-task-manager-q0l9.onrender.com";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      // Save session
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Welcome 🚀");

      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);

      alert(
        error.response?.data?.message ||
          "Invalid credentials, please try again."
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={logoStyle}>TF</div>

        <h2 style={titleStyle}>Login to TaskFlow</h2>

        <p style={subtitleStyle}>
          Enter your details to access your account
        </p>

        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          style={{ marginTop: "30px" }}
        >
          {/* Hidden autofill trap fields */}
          <input
            type="text"
            name="fakeusernameremembered"
            style={{ display: "none" }}
          />

          <input
            type="password"
            name="fakepasswordremembered"
            style={{ display: "none" }}
          />

          <label htmlFor="login-email" style={labelStyle}>
            Email Address
          </label>

          <input
            id="login-email"
            type="email"
            name="real_email_field_x"
            autoComplete="off"
            spellCheck="false"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />

          <label htmlFor="login-password" style={labelStyle}>
            Password
          </label>

          <input
            id="login-password"
            type="password"
            name="real_password_field_x"
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />

          <button type="submit" style={buttonStyle}>
            Sign In
          </button>
        </form>

        <p style={footerStyle}>
          Don't have an account?{" "}
          <Link to="/signup" style={linkStyle}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

// STYLES
const containerStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f1f5f9",
  fontFamily: "'Inter', sans-serif",
};

const cardStyle = {
  background: "white",
  padding: "40px",
  borderRadius: "24px",
  width: "100%",
  maxWidth: "400px",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
};

const logoStyle = {
  background: "#6366f1",
  color: "white",
  width: "50px",
  height: "50px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0 auto 20px",
};

const titleStyle = {
  margin: "0",
  fontSize: "24px",
  color: "#1e293b",
  fontWeight: "700",
};

const subtitleStyle = {
  fontSize: "14px",
  color: "#64748b",
  marginTop: "8px",
};

const labelStyle = {
  display: "block",
  textAlign: "left",
  fontSize: "13px",
  fontWeight: "600",
  color: "#475569",
  marginBottom: "6px",
  marginTop: "15px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  boxSizing: "border-box",
  outline: "none",
  marginBottom: "10px",
  fontSize: "15px",
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "25px",
  background: "#6366f1",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
};

const footerStyle = {
  marginTop: "25px",
  fontSize: "14px",
  color: "#64748b",
};

const linkStyle = {
  color: "#6366f1",
  fontWeight: "600",
  textDecoration: "none",
  cursor: "pointer",
};

export default Login;