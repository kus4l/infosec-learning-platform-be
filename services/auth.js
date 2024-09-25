import { LoginModel } from "../models/credentials.js";

let loginAttempts = {};

export const login = async (req, res) => {
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
};
