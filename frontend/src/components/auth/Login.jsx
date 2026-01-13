import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { Button } from "@primer/react";
import "./auth.css";
import logo from "../../assets/RepoVault.svg";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setCurrentUser } = useAuth();

  // Validation functions
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/login", {
        email: email.trim(),
        password: password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);

      window.location.href = "/";
    } catch (err) {
      // Handle different error types
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
      console.error("Login error:", err.response?.status);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box-wrapper">
        <div className="login-logo-container">
          <img src={logo} alt="RepoVault Logo" className="logo-login" />
          <span className="logo-text">RepoVault</span>
        </div>

        <div className="login-heading">
          <h2>Sign in</h2>
        </div>

        <form className="login-box" onSubmit={handleLogin}>
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <div>
            <label className="label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
              aria-required="true"
            />
          </div>

          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                className="input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
                aria-required="true"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="pass-box">
          <p>
            New to RepoVault? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;