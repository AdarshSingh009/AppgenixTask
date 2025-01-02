import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./Pages/Home";
import Ragistration from "./components/Ragistration";
import "../src/assets/Style/style.css";

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Ragistration />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/home"
          element={user ? <Home user={user} /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
