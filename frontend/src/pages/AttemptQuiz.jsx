import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

const AttemptQuiz = () => {
  const { quizId, courseId } = useParams(); 
  const { token } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quizzes/course/${courseId}`, {
          headers: {
            "x-auth-token": token,
          },
        });

        const foundQuiz = res.data.find((q) => q._id === quizId);
        if (foundQuiz) setQuiz(foundQuiz);
        else setMessage("Quiz not found in course.");
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setMessage("Failed to load quiz.");
      }
    };

    fetchQuiz();
  }, [courseId, quizId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAnswer) {
      setMessage("Please select an answer.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/quizzes/${quizId}/submit`,
        { answers: [selectedAnswer] },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      navigate("/result", { state: res.data });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setMessage("Failed to submit quiz.");
    }
  };

  if (!quiz) return <p>Loading quiz...</p>;

  const question = quiz.questions[0];

  return (
    <div style={styles.container}>
      <h2>{quiz.topic}</h2>
      <p>{question.question}</p>

      <form onSubmit={handleSubmit}>
        {question.options.map((opt, idx) => (
          <div key={idx}>
            <label>
              <input
                type="radio"
                name="option"
                value={opt}
                checked={selectedAnswer === opt}
                onChange={() => setSelectedAnswer(opt)}
              />
              {opt}
            </label>
          </div>
        ))}

        <button type="submit" style={styles.button}>Submit Quiz</button>
      </form>

      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "1rem",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  button: {
    marginTop: "1rem",
    padding: "0.6rem 1.2rem",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default AttemptQuiz;
