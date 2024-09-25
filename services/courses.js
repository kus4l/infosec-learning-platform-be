import fs from "fs";

export const getCourseList = async (req, res) => {
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
};

export const startNewCourse = async (req, res) => {
  async (req, res) => {
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
  };
};

