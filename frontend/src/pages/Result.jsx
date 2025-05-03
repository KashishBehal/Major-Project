import React from "react";
import { useLocation, useNavigate } from "react-router-dom";


const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;

  if (!result) {
    return (
      <div style={styles.container}>
        <p>No result data found.</p>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>Quiz Result</h2>
      <p><strong>Score:</strong> {result.score} / {result.total}</p>
      <p><strong>Summary:</strong> {result.summary}</p>

      <button style={styles.button} onClick={() => navigate("/student")}>Back to Dshboard</button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "2rem",
    borderRadius: "10px",
    backgroundColor: "#e6f7ff",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  button: {
    marginTop: "1rem",
    padding: "0.6rem 1.2rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default Result;
