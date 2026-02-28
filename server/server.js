const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/hello", (req, res) => {
  res.send("Hello Riya 🚀 Server is working!");
});

// app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/timetables', require('./routes/timetableRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
