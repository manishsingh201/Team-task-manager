import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import TeamView from "./pages/TeamView";
import Projects from "./pages/Project";
import Layout from "./pages/Layout"; // naya file jo banaya

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes - Layout nahi chahiye inhe */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Main App Routes - Layout ke andar wrap karo */}
        <Route
          path="/dashboard"
          element={
            <Layout isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}>
              <Dashboard isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            </Layout>
          }
        />
        <Route
          path="/team"
          element={
            <Layout isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}>
              <TeamView isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            </Layout>
          }
        />
        <Route
          path="/projects"
          element={
            <Layout isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}>
              <Projects isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;