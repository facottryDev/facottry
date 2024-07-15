import Master from "../models/scale/master.js";
import crypto from "crypto";

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
        return res.status(400).json({ message: "ProjectID is required" });
      case !filter:
        return res.status(400).json({ message: "Filter is required" });
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
      return res.status(200).json({
        code: "NO_MAPPING",
        message: "No Mapping Found",
        mappings: {
          appConfig: {},
          playerConfig: {},
          customConfig: {},
          filter: {},
        },
      });
    }

    const appConfig = master.appConfig?.params || {};
    const playerConfig = master.playerConfig?.params || {};
    const customConfig = {};

    if (master.customConfig) {
      for (const key in master.customConfig) {
        if (master.customConfig[key].params) {
          customConfig[key] = master.customConfig[key].params;
        }
      }
    }

    const resObj = {
      appConfig,
      playerConfig,
      customConfig,
      filter: master.filter,
      projectID: master.projectID,
      companyID: master.companyID,
    };

    res
      .status(200)
      .json({ code: "FOUND", message: "Success", mappings: resObj });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }
};