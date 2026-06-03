require("dotenv").config({ override: true });
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes"); 
const sessionRoutes = require("./routes/sessionRoutes");
const questionRoutes = require("./routes/questionRoutes");
const { protect } = require("./middlewares/authMiddlewares");
const {
  generateInterviewQuestions,
  generateConceptExplanation,
} = require("./controllers/aiController");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["content-type", "Authorization"],
  })
);

connectDB();

// Middleware
app.use(express.json());

// Change Made: This line now correctly points to the fully defined auth routes, including the image upload endpoint.
app.use("/api/auth", authRoutes);
app.use("/api/sessions", protect, sessionRoutes); // It's good practice to protect session routes
app.use("/api/questions", protect, questionRoutes); // It's good practice to protect question routes

app.post("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.post("/api/ai/generate-explanation", protect, generateConceptExplanation);
app.get("/api/ai/debug-key", (req, res) => res.json({ key: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'undefined' }));

// This serves the images from the 'uploads' folder to the frontend
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));