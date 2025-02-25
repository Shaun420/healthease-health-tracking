import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // External CSS file for styling
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username || !password) {
        alert("Please enter username and password");
        return;
        }

        try {
          const response = await axios.post("http://localhost:5000/login", { username, password });
          localStorage.setItem("authToken", response.data.token); // Store token, not raw credentials
          navigate("/");
        } catch (error) {
          alert("Invalid username or password");
        }
    };

  return (
    <div className="container">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <a href="/newpatient">Create an Account here</a>
    </div>
  );
};

export default Login;
