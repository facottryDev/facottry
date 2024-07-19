import Master from "../models/scale/master.js";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import axios from "axios";

// SCALE AUTHENTICATION
export const scaleAuth = (req, res, next) => {
  try {
    const clientHash = req.headers["x-client-hash"];
    const date = new Date();
    const currentHour = date.getHours();
    // Adjust to change every 5 minutes
    const currentMinute = Math.floor(date.getMinutes() / 5) * 5;
    let isAuthenticated = false;

    const permanentSalt = process.env.SCALE_SALT;

    for (let randomizer = 0; randomizer <= 9; randomizer++) {
      const temporarySalt = `${currentHour}${currentMinute}`;
      const dataToHash = `${permanentSalt}${temporarySalt}${randomizer}`;
      const generatedHash = crypto
        .createHash("sha256")
        .update(dataToHash)
        .digest("hex");

      if (generatedHash === clientHash) {
        isAuthenticated = true;
        break;
      }
    }

    if (isAuthenticated) {
      next();
    } else {
      return res.status(401).send("Authentication Failed");
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }
};

// GET MAPPING FROM FILTER PARAMS
export const getMapping = async (req, res) => {
  try {
    const { projectID, filter } = req.body;

    switch (true) {
      case !projectID:
        res.status(400).json({ message: "ProjectID is required" });
        setImmediate(async () => await loggerFunction(req, projectIDError));
        return;
      case !filter:
        res.status(400).json({ message: "Filter is required" });
        setImmediate(async () => await loggerFunction(req, filterError));
        return;
    }

    const master = await Master.findOne(
      {
        projectID,
        status: "active",
        filter,
      },
      {
        _id: 0,
        __v: 0,
        status: 0,
        createdAt: 0,
        updatedAt: 0,
      }
    );

    if (!master) {
      const noMappingResponse = {
        code: "NO_MAPPING",
        message: "No Mapping Found",
        mappings: {
          appConfig: {},
          playerConfig: {},
          customConfig: {},
          filter: {},
        },
      };
      res.status(200).json(noMappingResponse);
      setImmediate(async () => await loggerFunction(req, noMappingResponse));
      return;
    }

    const appConfig = master.appConfig?.params || {};
    const playerConfig = master.playerConfig?.params || {};
    const resObj = {
      appConfig,
      playerConfig,
      filter: master.filter,
      projectID: master.projectID,
      companyID: master.companyID,
    };

    if (master.customConfig) {
      for (const key in master.customConfig) {
        resObj[key] = master.customConfig[key].params;
      }
    }

    const successResponse = {
      code: "FOUND",
      message: "Success",
      mappings: resObj,
    };
    res.status(200).json(successResponse);
    setImmediate(async () => await loggerFunction(req, successResponse));
  } catch (error) {
    console.log(error.message);
    const errorResponse = { message: error.message };
    res.status(500).send(errorResponse);
    setImmediate(async () => await loggerFunction(req, errorResponse));
  }
};

// LOGGER FUNCTION
const loggerFunction = async (req, resObj) => {
  try {
    const { projectID, filter } = req.body;

    // Get current date and time
    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

    // Filename format: <filter>_<timestamp>.json
    const filterString = Object.values(filter)
      .map((value) => (value === "" ? "DEFAULT" : value))
      .join("_");
    const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}_${milliseconds}`;

    // Define log directory and file path
    const logDir = path.join(
      process.cwd(),
      "logs",
      projectID,
      year,
      month,
      day
    );
    const logFilePath = path.join(logDir, `${filterString}_${timestamp}.json`);

    // Ensure the logs directory exists
    fs.mkdir(logDir, { recursive: true }, (err) => {
      if (err) {
        console.error("Failed to create log directory:", err);
        return;
      }

      // Log the request and response
      const logEntry = {
        timestamp: now.toISOString(),
        request: {
          body: req.body,
          headers: req.headers,
          method: req.method,
          url: req.url,
        },
        response: resObj,
      };

      fs.writeFile(logFilePath, JSON.stringify(logEntry, null, 2), (err) => {
        if (err) {
          console.error("Failed to write log:", err);
        }
      });
    });

    // Send the log metadata to analytics service
    const analytics_URL = process.env.ANALYTICS_SERVER_URL;
    const basename = path.basename(logFilePath);
    const pathname = `${projectID}/${year}/${month}/${day}/${basename}`;

    if (analytics_URL) {
      await axios.post(analytics_URL + "/update-logs", {
        projectID,
        filter,
        pathname,
      });
    } else {
      console.log({ message: "Analytics service URL not found" });
    }
  } catch (error) {
    console.log({ error: error.message, code: "LOGGER_FUNCTION" });
  }
};

// GET LOGS
export const getLogs = (req, res) => {
  const { startDate, endDate } = req.query;

  // Parse the start and end dates in "YYYY-MM-DD" format
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T23:59:59Z`);

  // Ensure the dates are valid
  if (isNaN(start) || isNaN(end)) {
    return res.status(400).send({ error: "Invalid date range" });
  }

  // Construct the root log directory path
  const logDir = path.join(process.cwd(), "logs");

  // Function to get all files in a directory recursively
  const getFiles = (dir, files = []) => {
    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        getFiles(filePath, files);
      } else {
        files.push(filePath);
      }
    });
    return files;
  };

  // Get all log files
  const allFiles = getFiles(logDir);

  // Filter log files by date range
  const logs = allFiles
    .filter((file) => {
      const fileName = path.basename(file, ".json");
      const [filter, timestamp] = fileName.split("_");
      const fileDate = new Date(
        `${timestamp.slice(0, 4)}-${timestamp.slice(4, 6)}-${timestamp.slice(
          6,
          8
        )}T${timestamp.slice(9, 11)}:${timestamp.slice(
          11,
          13
        )}:${timestamp.slice(13, 15)}.${timestamp.slice(16, 19)}Z`
      );
      return fileDate >= start && fileDate <= end;
    })
    .map((file) => {
      return JSON.parse(fs.readFileSync(file, "utf8"));
    });

  // Send the logs as a response
  res.send(logs);
};