import fs from "fs";
import path from "path";

// CHECK LOGIN
export const isAuth = (req, res, next) => {
  if (!req.session.username && !req.user) {
    return res.status(401).json("Not Logged In");
  }

  next();
};

export const logRequestResponse = (req, res, next) => {
  const { projectID } = req.body;

  // Get current date and time
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");

  // Define log directory and file path
  const logDir = path.join(process.cwd(), "logs", projectID, year, month, day);
  const logFilePath = path.join(
    logDir,
    `${projectID}_${hour}-${minute}-${second}.json`
  );

  // Ensure the logs directory exists
  fs.mkdir(logDir, { recursive: true }, (err) => {
    if (err) {
      console.error("Failed to create log directory:", err);
      return next();
    }

    // Capture the original send method
    const originalSend = res.send;

    // Override the send method to capture the response body
    res.send = function (body) {
      const logEntry = {
        timestamp: now.toISOString(),
        request: {
          body: req.body,
          headers: req.headers,
          method: req.method,
          url: req.url,
        },
        response: body,
      };

      fs.writeFile(logFilePath, JSON.stringify(logEntry, null, 2), (err) => {
        if (err) {
          console.error("Failed to write log:", err);
        }
      });

      return originalSend.call(this, body);
    };

    next();
  });
};