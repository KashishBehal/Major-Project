const axios = require('axios');
const Quiz = require('../models/Quiz');
const StudentResponse = require('../models/StudentResponse');

// Create quiz (teacher only)
const createQuiz = async (req, res) => {
  const { topic, content, courseId } = req.body;
  const teacherId = req.user.id;

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/valhalla/t5-base-qg-hl',
      {
        inputs: `generate question: ${content}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        },
      }
    );

    const questionText = response.data[0]?.generated_text || 'What is the topic about?';

    const newQuiz = new Quiz({
      topic,
      courseId,
      createdBy: teacherId,
      questions: [
        {
          question: questionText,
          options: ['Option A', 'Option B', 'Option C', 'Option D'], // can be updated later
          correctAnswer: 'Option A',
        },
      ],
    });

    await newQuiz.save();
    res.status(201).json({ message: 'Quiz created successfully', quiz: newQuiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create quiz' });
  }
};

// Student view quizzes
const getQuizzesByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const quizzes = await Quiz.find({ courseId });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch quizzes' });
  }
};


// Student submits quiz answers
const submitQuiz = async (req, res) => {
  const { quizId } = req.params;
  const { answers } = req.body;
  const studentId = req.user.id;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Compare student answers with correct ones
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) score++;
    });

    const response = new StudentResponse({
      studentId,
      quizId,
      answers,
      score,
    });

    await response.save();

    res.json({
      message: 'Quiz submitted successfully',
      score,
      total: quiz.questions.length,
      summary: `You scored ${score} out of ${quiz.questions.length}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Submission failed' });
  }
};


module.exports = {
  createQuiz,
  getQuizzesByCourse,
  submitQuiz
};

