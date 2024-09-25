// const connectDB = require("./db");
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  getCompletedCourseList,
  downloadCourseContent,
} from "./services/home.js";
import { getCourseList, startNewCourse } from "./services/courses.js";
import { getCourseById } from "./services/course.js";
import { login } from "./services/auth.js";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT || 5000;

//ROUTES

// AUTH ROUTES
app.post("/login", login);

// HOME ROUTES
app.get("/completed-courses", getCompletedCourseList);
app.get("/download-news-article", downloadCourseContent);

// COURSES ROUTES
app.get("/courses", getCourseList);
app.post("/start-new-course", startNewCourse);

// COURSE ROUTES
app.get("/get-course-by-id", getCourseById);

//SERVER
app.listen(PORT, () => {
  // connectDB();
  console.log(`Server running on port ${PORT}`);
});
