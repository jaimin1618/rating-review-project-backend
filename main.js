require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// Create review schema
const reviewSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  review: {
    type: String,
    required: true,
  },
});

const teacherSchema = new mongoose.Schema({
  teacherName: {
    type: String,
    required: true,
  },
});

// Create review model
const Review = mongoose.model("Review", reviewSchema);
const Teacher = mongoose.model("Teacher", teacherSchema);

// Get all reviews for a teacher
app.get("/reviews/:teacherId", async (req, res) => {
  try {
    const reviews = await Review.find({ teacherId: req.params.teacherId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/teacher", async (req, res) => {
  const teacher = new Teacher({
    teacherName: req.body.teacherName,
  });

  try {
    const newTeacher = await teacher.save();
    res.status(201).json(newTeacher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/teacher", async (req, res) => {
  try {
    const teachers = await Teacher.find({});
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/teacher/:teacherId", async (req, res) => {
  const teacherId = req.params.teacherId;
  try {
    const teacher = await Teacher.find({ _id: teacherId });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new review for a teacher
app.post("/reviews", async (req, res) => {
  const review = new Review({
    teacherId: req.body.teacherId,
    teacherName: req.body.teacherName,
    review: req.body.review,
  });

  try {
    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
