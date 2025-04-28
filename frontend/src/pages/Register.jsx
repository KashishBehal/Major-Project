import React, { useState } from "react";
import "../App.css";
import axios from "../api/axios";  // Ensure your axios instance is properly configured

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // To show loading state
  const [success, setSuccess] = useState(""); // To show success message after registration

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = form;

    // Validate form fields
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    // Set loading state while waiting for response
    setLoading(true);
    setError(""); // Clear previous error if any

    try {
      // Send registration request to backend
      const response = await axios.post("/api/auth/register", { name, email, password, role });

      // Set success message on successful registration
      setSuccess("User registered successfully. Please log in.");
      setForm({ name: "", email: "", password: "", role: "student" }); // Reset form fields
    } catch (error) {
      console.error(error);
      // Set error message from response or default to generic message
      setError(error.response?.data?.msg || "Registration failed. Please try again.");
    } finally {
      // Reset loading state after the request is completed
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register">
        <h2>Register</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
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
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
