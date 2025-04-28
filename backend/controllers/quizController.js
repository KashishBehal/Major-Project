const axios = require('axios');
const Quiz = require('../models/Quiz');
const StudentResponse = require('../models/StudentResponse');

// Helper: Split paragraph into sentences
const splitIntoSentences = (text) => {
  return text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
};

// Create quiz (teacher only)
const createQuiz = async (req, res) => {
  const { topic, content, courseId } = req.body;
  const teacherId = req.user.id;

  try {
    // Split into sentences and pick first 5
    const sentences = splitIntoSentences(content).slice(0, 5);

    // Generate question for each sentence
    const questionPromises = sentences.map(async (sentence) => {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/iarfmoose/t5-base-question-generator',
        { inputs: sentence },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
          },
        }
      );
      return response.data[0];
    });

    const generatedQuestions = await Promise.all(questionPromises);

    // Generate summary
    const summaryResponse = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      { inputs: content },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        },
      }
    );

    const summary = summaryResponse.data[0]?.summary_text || 'Summary not available';

    // Prepare questions array
    const questions = generatedQuestions.map((q) => ({
      question: q.question,
      options: q.answers,
      correctAnswer: q.answers[0], // assume first answer is correct
    }));

    const newQuiz = new Quiz({
      topic,
      courseId,
      createdBy: teacherId,
      questions,
      summary,
    });

    await newQuiz.save();
    res.status(201).json({ message: 'Quiz created successfully', quiz: newQuiz });
  } catch (error) {
    console.error(error.response?.data || error);
    res.status(500).json({ message: 'Failed to create quiz' });
  }
};

// Student views quizzes of a course
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
      summary: quiz.summary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Submission failed' });
  }
};

module.exports = {
  createQuiz,
  getQuizzesByCourse,
  submitQuiz,
};
