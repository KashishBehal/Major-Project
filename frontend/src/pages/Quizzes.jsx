import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";

const Quizzes = () => {
  const { token } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    if (!token) {
      setMessage("You must be logged in as a student.");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/quizzes/course/${courseId}`, {
        headers: {
          "x-auth-token": token,
        },
      });

      setQuizzes(res.data);
      setMessage(res.data.length ? "" : "No quizzes found for this course.");
    } catch (error) {
      console.error("Error fetching quizzes:", error.response || error.message);
      setMessage("Failed to fetch quizzes. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!courseId.trim()) {
      setMessage("Please enter a Course ID.");
      return;
    }
    fetchQuizzes();
  };

  const handleQuizClick = (quizId) => {
    navigate(`/attempt/${courseId}/${quizId}`);
  };

  return (
    <div style={styles.container}>
      <h2>View Quizzes</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Enter Course ID"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Fetch Quizzes</button>
      </form>

      {message && <p>{message}</p>}

      <div style={styles.quizList}>
        {quizzes.map((quiz, index) => (
          <div
            key={quiz._id || index}
            style={styles.quizCard}
            onClick={() => handleQuizClick(quiz._id)}
          >
            <h4>{quiz.topic}</h4>
            <p>{quiz.content}</p>
            <p style={{ color: "blue", cursor: "pointer" }}>Click to Attempt</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "700px",
    margin: "2rem auto",
    padding: "2rem",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f0f8ff",
  },
  form: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1rem",
  },
  input: {
    flex: 1,
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "0.6rem 1rem",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  quizList: {
    marginTop: "1.5rem",
  },
  quizCard: {
    padding: "1rem",
    marginBottom: "1rem",
    backgroundColor: "#ffffff",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    cursor: "pointer",
  },
};

export default Quizzes;

