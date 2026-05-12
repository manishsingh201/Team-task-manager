import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "Member" });

  const handleSignup = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/register`, formData);
      alert("Account Created Successfully! 🎉");
      navigate("/"); // Register hone ke baad wapas Login page pe
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={logoStyle}>TF</div>
        <h2 style={titleStyle}>Create Account</h2>
        <p style={subtitleStyle}>Join TaskFlow to manage your team effectively</p>
        
        <div style={{ marginTop: "20px" }}>
          <label style={labelStyle}>Full Name</label>
          <input type="text" placeholder="Mohan Singh" onChange={(e) => setFormData({...formData, name: e.target.value})} style={inputStyle} />
          
          <label style={labelStyle}>Email Address</label>
          <input type="email" placeholder="name@company.com" onChange={(e) => setFormData({...formData, email: e.target.value})} style={inputStyle} />
          
          <label style={labelStyle}>Password</label>
          <input type="password" placeholder="••••••••" onChange={(e) => setFormData({...formData, password: e.target.value})} style={inputStyle} />

          <label style={labelStyle}>Select Role</label>
          <select onChange={(e) => setFormData({...formData, role: e.target.value})} style={inputStyle}>
            <option value="Member">Team Member</option>
            <option value="Admin">Project Manager (Admin)</option>
          </select>
          
          <button onClick={handleSignup} style={buttonStyle}>Get Started</button>
        </div>

        <p style={footerStyle}>
          Already have an account?{" "}
          <Link to="/" style={linkStyle}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

// Styles are identical to Login for a consistent UI
const containerStyle = { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f1f5f9", fontFamily: "'Inter', sans-serif" };
const cardStyle = { background: "white", padding: "40px", borderRadius: "24px", width: "100%", maxWidth: "420px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)", textAlign: "center" };
const logoStyle = { background: "#6366f1", color: "white", width: "50px", height: "50px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "bold", margin: "0 auto 20px" };
const titleStyle = { margin: "0", fontSize: "24px", color: "#1e293b", fontWeight: "700" };
const subtitleStyle = { fontSize: "14px", color: "#64748b", marginTop: "8px" };
const labelStyle = { display: "block", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px", marginTop: "12px" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", boxSizing: "border-box", outline: "none", background: "#f8fafc", marginBottom: "10px" };
const buttonStyle = { width: "100%", padding: "14px", marginTop: "20px", background: "#6366f1", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" };
const footerStyle = { marginTop: "25px", fontSize: "14px", color: "#64748b" };
const linkStyle = { color: "#6366f1", fontWeight: "600", textDecoration: "none", cursor: "pointer" };

export default Signup;