import React, { useState } from "react";
import "../App.css";

const Dashboard = () => {
  const [course, setCourse] = useState("");
  const [assignment, setAssignment] = useState("");
  const [quizAnswer, setQuizAnswer] = useState("");
  const [submittedAssignment, setSubmittedAssignment] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleCourseChange = (e) => setCourse(e.target.value);
  const handleAssignmentChange = (e) => setAssignment(e.target.value);
  const handleQuizAnswerChange = (e) => setQuizAnswer(e.target.value);

  const submitAssignment = () => {
    if (!assignment) return alert("Please enter your assignment");
    setSubmittedAssignment(assignment);
    setAssignment("");
  };

  const submitQuiz = () => {
    if (!quizAnswer) return alert("Please answer the quiz");
    setQuizSubmitted(true);
  };

  return (
    <div className="">
      <header className="b">
      <h1>DASHBOARD</h1>
        <div className="a">
           
            <h2>Home</h2>
            <h2>Courses</h2>
            <h2>Assignments</h2>
            <h2>Logout</h2>
        </div>
      </header>
      <main className="c">
       <div> <h1>Welcome to the Dashboard</h1>
        <p>Here you can manage your courses, assignments, and quizzes.</p>
        <p>Use the sections below to interact with your course materials.</p>
        <p>Feel free to explore and make the most of your learning experience!</p>
        
        <button>Courses</button>
        <br/>
        <p>Want to check progress?...Lets try some quizzesss....</p>
      
        <button>Quiz</button>
     </div>
     <div className="d"><img src="laptop.jpg"></img></div> </main>
     <section className=" section1">
        <h1>HERE ARE YOUR ENROLLED COURSES</h1>
        <br/>
        <div className="c1">
          <div>
            <h1>COURSE 1</h1>
            <img src="placeholder.jpg"></img>
          </div>
          <div>
            <h1>COURSE 2</h1>
            <img src="placeholder.jpg"></img>
          </div>
          <div>
            <h1>COURSE 3</h1>
            <img src="placeholder.jpg"></img>
          </div>
          
        </div>
     </section>
     <section className="quiz">
       <h1>TEST YOUR KNOWLEDGE !!</h1>
       <h1>click here to take a quiz</h1>
       <h1>Click to navigate to the quiz page</h1>
       <button>Quiz</button>

     </section>
     <section className="bot">
      <h2>WANT HELP?? ANY QUERIES????
      ALL ANSWERS ONE CLICK AWAY.....</h2>
      <h1>ALL PERSONLAIZED CHATBOT IS HERE...</h1>
      <button>Lets Chat</button>
      
     </section>
     <footer className="footer">All rights reserved @2025</footer>
    </div>
  );
};

export default Dashboard;