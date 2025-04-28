import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import axios from "../api/axios";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [emailForReset, setEmailForReset] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = form;

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      console.log("Trying login with: ", email, password);
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const token = res.data.token;
      console.log(res.data);

      // Save token
      setError("");
      localStorage.setItem("token", token);

      // Decode token manually
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role || "student"; // fallback role

      // Update AuthContext
      login({ email: payload.email, role });

      // Navigate based on role
      if (role === "teacher") {
        navigate("/teacher",{ replace: true });
      } else if (role === "admin") {
        navigate("/admin",{ replace: true });
      } else {
        navigate("/student",{ replace: true });
      }

    } catch (error) {
      console.error(error);
      setError(error.response?.data?.msg || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!emailForReset) {
      setError("Please provide an email address");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email: emailForReset });
      setError(res.data.message || "Password reset email sent successfully!");
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Error in sending reset link");
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      {showForgotPassword ? (
        <div className="forgot-password-form">
          <h2>Forgot Password</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={emailForReset}
            onChange={(e) => setEmailForReset(e.target.value)}
          />
          <button onClick={handleForgotPassword} disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          <button onClick={() => setShowForgotPassword(false)}>Back to Login</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="register">
          <h2>Login</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="current-password"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p style={{ marginTop: "10px" }}>
            <span
              onClick={() => setShowForgotPassword(true)}
              style={{ cursor: "pointer", color: "blue" }}
            >
              Forgot Password?
            </span>
          </p>

          <p style={{ marginTop: "10px" }}>
            Don't have an account?{" "}
            <span
              onClick={goToRegister}
              style={{ cursor: "pointer", color: "green", fontWeight: "bold" }}
            >
              Register Here
            </span>
          </p>
        </form>
      )}
    </div>
  );
};

export default Login;

