import Master from "../models/scale/master.js";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import axios, { all } from "axios";
import { redisClient } from "../server.js";

// SCALE AUTHENTICATION
export const scaleAuth = (req, res, next) => {
  try {
    const clientHash = req.headers["x-client-hash"];
    const date = new Date();
    const currentHour = date.getUTCHours();
    const currentMinute = Math.floor(date.getUTCMinutes() / 5) * 5;
    let isAuthenticated = false;

    const permanentSalt = process.env.SCALE_SALT;

    if (clientHash === "facottrySuperAdmin2000") {
      next();
    }

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
    const {
      projectID,
      filter,
      noCache,
      resetCacheforFilter,
      resetCacheforProject,
    } = req.body;

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

    // Serve Cache
    if (resetCacheforFilter) {
      await redisClient.DEL(cacheKey);
      console.log("Cache reset for Filter");
    } else if (resetCacheforProject) {
      const keys = await redisClient.keys(`mapping:${projectID}:*`);
      await redisClient.DEL(keys);
      console.log("Cache reset for Project");
    } else if (!noCache && cachedData) {
      const cachedResponse = JSON.parse(cachedData);
      cachedResponse.cacheStatus = true;
      res.status(200).json(cachedResponse);
      setImmediate(async () => await loggerFunction(req, cachedResponse));
      console.log("Cache Hit");
      return;
    }

    const allMasters = await Master.find(
      {
        projectID,
        status: "active",
      },
      {
        _id: 0,
        __v: 0,
        status: 0,
        createdAt: 0,
        updatedAt: 0,
      }
    );

    if (allMasters.length === 0) {
      const noMappingResponse = {
        code: "NO_MAPPING",
        message: "No Mapping In Project",
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
      });
      return;
    }

    // generate subsets of filters
    const generateSubsets = (filter) => {
      const keys = Object.keys(filter);
      const subsets = keys.reduce(
        (subsets, key) => {
          const newSubsets = subsets.map((set) => {
            const newSet = { ...set };
            newSet[key] = filter[key];
            return newSet;
          });
          return subsets.concat(newSubsets);
        },
        [{}]
      );
      return subsets;
    };

    const subsets = generateSubsets(filter);

    const MatchedMaster = [];

    for (const subset of subsets) {
      // check if subset is present in any of the fetched masters
      if (subset && Object.keys(subset).length > 0) {
        const master = allMasters.find((master) => {
          const masterFilter = master.filter;
          return Object.entries(subset).every(
            ([key, value]) => masterFilter[key] === value
          );
        });

        if (master) {
          const rank = Object.keys(subset).length; // rank based on number of matched keys
          MatchedMaster.push({
            master,
            rank,
            masterLength: Object.keys(master.filter).length,
          });
        }
      }
    }

    // sort the matched masters based on rank in descending order, using masterLength as a tiebreaker
    MatchedMaster.sort((a, b) => {
      if (b.rank === a.rank) {
        return b.masterLength - a.masterLength; // tiebreaker: more specific master filter ranks higher
      }
      return b.rank - a.rank;
    });

    if (MatchedMaster.length === 0) {
      const mappings = {
        appConfig: allMasters[0].appConfig?.params || {},
        playerConfig: allMasters[0].playerConfig?.params || {},
      }

      const noMappingResponse = {
        code: "NO_MAPPING",
        message: "Serving Default Mapping",
        cacheStatus: false,
        data: {
          filter: allMasters[0].filter,
          settings: {
            projectID: projectID,
          },
          mappings,
        },
      };

      setImmediate(async () => {
        await loggerFunction(req, noMappingResponse);
      });
      return res.status(200).json(noMappingResponse);
    }

    const master = MatchedMaster[0].master;

    const appConfig = master.appConfig?.params || {};
    const playerConfig = master.playerConfig?.params || {};

    const mappings = {
      appConfig,
      playerConfig,
    };

    if (master.customConfig) {
      for (const key in master.customConfig) {
        mappings[key] = master.customConfig[key].params;
      }
    }

    let successResponse = {}

    const isFilterMatch = Object.keys(filter).every(
      (key) => master.filter[key] === filter[key]
    );

    if (isFilterMatch) {
      successResponse = {
        code: "FOUND",
        message: "Successfully Fetched Mapping",
        cacheStatus: false,
        data: {
          filter: master.filter,
          settings: {
            projectID: master.projectID,
            companyID: master.companyID,
          },
          mappings,
        },
      };
    } else {
      successResponse = {
        code: "FOUND_WITH_MISMATCH",
        message: "Fetched Mapping With Filter Mismatch",
        cacheStatus: false,
        data: {
          filter: master.filter,
          settings: {
            projectID: master.projectID,
            companyID: master.companyID,
          },
          mappings,
        },
      };
    }

    res.status(200).json(successResponse);
    setImmediate(async () => {
      await loggerFunction(req, successResponse);
      await redisClient.set(cacheKey, JSON.stringify(successResponse));
      await redisClient.expire(cacheKey, 300);
    });
  } catch (error) {
    const errorResponse = { message: error.message };
    res.status(500).json(errorResponse);
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
    // console.log({ error: error.message, code: "LOGGER_FUNCTION" });
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
