import Master from "../models/scale/master.js";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import axios from "axios";
import { redisClient } from "../server.js";

// SCALE AUTHENTICATION
export const scaleAuth = (req, res, next) => {
  try {
    const clientHash = req.headers["x-client-hash"];
    const date = new Date();
    const currentHour = date.getHours();
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

        console.log({
          dataToHash
        })

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
    const { projectID, filter, noCache } = req.body;

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

    const filterString = JSON.stringify(filter);
    const cacheKey = `mapping:${projectID}:${filterString}`;
    const cachedData = await redisClient.get(cacheKey);

    if (!noCache && cachedData) {
      const cachedResponse = JSON.parse(cachedData);
      cachedResponse.cacheStatus = true;
      res.status(200).json(cachedResponse);
      setImmediate(async () => await loggerFunction(req, cachedResponse));
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
        cacheStatus: false,
        data: {
          mappings: {},
          filter,
          settings: {
            projectID: projectID,
          },
        },
      };

      res.status(200).json(noMappingResponse);
      setImmediate(async () => {
        await loggerFunction(req, noMappingResponse);
        await redisClient.set(cacheKey, JSON.stringify(noMappingResponse));
        await redisClient.expire(cacheKey, 3600); // 1 hour
      });
      return;
    }

    const appConfig = master.appConfig?.params || {};
    const playerConfig = master.playerConfig?.params || {};

    const allMappings = {
      appConfig,
      playerConfig,
    };

    if (master.customConfig) {
      for (const key in master.customConfig) {
        allMappings[key] = master.customConfig[key].params;
      }
    }

    const successResponse = {
      code: "FOUND",
      message: "Mapping Found",
      cacheStatus: false,
      data: {
        filter: master.filter,
        settings: {
          projectID: master.projectID,
          companyID: master.companyID,
        },
        mappings: allMappings,
      },
    };
    res.status(200).json(successResponse);
    setImmediate(async () => {
      await loggerFunction(req, successResponse);
      await redisClient.set(cacheKey, JSON.stringify(successResponse));
      await redisClient.expire(cacheKey, 3600);
    });
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

      const safeHeaders = {
        "x-client-hash": req.headers["x-client-hash"],
        "x-forwarded-for": req.headers["x-forwarded-for"],
        "x-real-ip": req.headers["x-real-ip"],
        "x-amzn-trace-id": req.headers["x-amzn-trace-id"],
        "user-agent": req.headers["user-agent"],
      };

      // Log the request and response
      const logEntry = {
        timestamp: now.toISOString(),
        request: {
          body: req.body,
          headers: safeHeaders,
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

// GET LOG BY PATHNAME
export const getLogData = async (req, res) => {
  try {
    const { pathname } = req.query;
    console.log(pathname);

    if (!pathname) {
      return res.status(400).json({ message: "Pathname is required" });
    }

    const logFilePath = path.join(process.cwd(), "logs", pathname);

    fs.readFile(logFilePath, "utf8", (err, data) => {
      if (err) {
        console.error("Failed to read log file:", err);
        return res.status(404).json({ message: "Log not found" });
      }

      const logData = JSON.parse(data);
      res.status(200).json(logData);
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }
};
