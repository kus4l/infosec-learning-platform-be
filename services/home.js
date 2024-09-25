import fs from "fs";

export const getCompletedCourseList = async (req, res) => {
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
};

export const downloadCourseContent = (req, res) => {
  try {
    const filePath = `configs/news-template-configurations.json`;
    const fileData = fs.readFileSync(filePath, "utf8");
    const fileDataDecode = JSON.parse(fileData);
    const fileName = fileDataDecode[req.query.name].file;
    const assetPath = `../assets/${fileName}`;

    if (fs.existsSync(assetPath)) {
      res.sendFile(fileName, { root: "./assets" });
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
