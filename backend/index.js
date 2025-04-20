require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http'); 
const socketIO = require('socket.io'); 
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const userRoutes= require('./routes/userRoutes');



const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

// Routes 
app.use('/api/auth',authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/users', userRoutes);


// Socket.IO setup
const server = http.createServer(app); 
const io = socketIO(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); 
  });
});

server.listen(port, () => { 
  console.log(`Server is running on port: ${port}`);
});