// const connectDB = require("./db");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const dotenv = require("dotenv");
const LoginModel = require("./models/credentials");

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

let loginAttempts = {};
const PORT = process.env.PORT || 5000;

//ROUTES

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const currentTime = Date.now();

  if (
    loginAttempts[username] &&
    loginAttempts[username].lockUntil > currentTime
  ) {
    const remainingTime = Math.ceil(
      (loginAttempts[username].lockUntil - currentTime) / 1000
    );

    return res.status(403).json({
      message: `Account is locked. Try again in ${remainingTime} seconds.`,
    });
  }

  try {
    const user = await LoginModel.findOne({ username });

    if (!user || user.password !== password) {
      loginAttempts[username] = loginAttempts[username] || {
        attempts: 0,
        lockUntil: null,
      };
      loginAttempts[username].attempts += 1;

      if (loginAttempts[username].attempts >= 5) {
        loginAttempts[username].lockUntil = currentTime + 30 * 60 * 1000; // Lock for 30 minutes
        return res
          .status(403)
          .json({ message: "Account locked. Please try again in 30 minutes." });
      }

      return res.status(401).json({
        message: `Login failed. Attempt ${loginAttempts[username].attempts}/5.`,
      });
    }

    loginAttempts[username] = { attempts: 0, lockUntil: null };
    return res.json({ message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/courses", async (req, res) => {
  try {
    const { userId } = req.query;
    const statementKeysPath = `configs/courses.json`;
    let templateData = fs.readFileSync(statementKeysPath, "utf8");
    const responseData = { status: 1, data: templateData };

    return res.status(200).json(responseData);
  } catch (error) {
    return res
      .status(500)
      .json({ status: -1, message: "Internal server error" });
  }
});

app.get("/completed-courses", async (req, res) => {
  try {
    const { userId } = req.query;
    const statementKeysPath = `configs/courses.json`;
    let templateData = fs.readFileSync(statementKeysPath, "utf8");

    templateData = JSON.parse(templateData);

    templateData = templateData.filter((course) => course.userStatus.completed);

    const responseData = { status: 1, data: JSON.stringify(templateData) };

    return res.status(200).json(responseData);
  } catch (error) {
    return res
      .status(500)
      .json({ status: -1, message: "Internal server error" });
  }
});

app.get("/download-news-article", (req, res) => {
  try {
    const filePath = `configs/news-template-configurations.json`;
    const fileData = fs.readFileSync(filePath, "utf8");
    const fileDataDecode = JSON.parse(fileData);
    const fileName = fileDataDecode[req.query.name].file;
    const assetPath = `./assets/${fileName}`;

    if (fs.existsSync(assetPath)) {
      res.sendFile(fileName, { root: "./assets" });
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/start-new-course", async (req, res) => {
  const { courseId } = req.body;

  try {
    const statementKeysPath = `configs/courses.json`;
    let templateData = fs.readFileSync(statementKeysPath, "utf8");

    templateData = JSON.parse(templateData);
    const course = templateData.find((course) => course.id == courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.userStatus = {
      ...course.userStatus,
      startDate: new Date(),
      completed: false,
      prcentageCompleted: 0,
    };

    fs.writeFileSync(statementKeysPath, JSON.stringify(templateData));

    return res.status(200).json({ message: "Course started" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//SERVER
app.listen(PORT, () => {
  // connectDB();
  console.log(`Server running on port ${PORT}`);
});
