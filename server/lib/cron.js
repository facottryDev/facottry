import cron from "node-cron";

import users from "../models/auth/user.js";
import userArchives from "../models/auth/userArchive.js";

import project from "../models/admin/project.js";
import projectArchives from "../models/admin/projectArchive.js";
import company from "../models/admin/company.js";
import companyArchives from "../models/admin/companyArchive.js";

import master from "../models/scale/master.js";
import masterArchives from "../models/scale/masterArchive.js";
import appConfig from "../models/configs/appConfig.js";
import appConfigArchives from "../models/configs/appConfigArchive.js";
import playerConfig from "../models/configs/playerConfig.js";
import playerConfigArchives from "../models/configs/playerConfigArchive.js";
import customConfig from "../models/configs/customConfig.js";
import customConfigArchives from "../models/configs/customConfigArchive.js";

// CRON JOB TO SHIFT INACTIVE USERS TO ARCHIVE
export const startCronJobs = () => {
  cron.schedule(
    "25 2 17 * *",
    async () => {
      try {
        console.log(`Cron Job Started ${new Date()}`);

        // ARCHIVE INACTIVE USERS
        const inactiveUsers = await users.find({ status: "inactive" });
        await userArchives.insertMany(inactiveUsers);
        await users.deleteMany({ status: "inactive" });

        // ARCHIVE INACTIVE PROJECTS
        const inactiveProjects = await project.find({ status: "inactive" });
        await projectArchives.insertMany(inactiveProjects);
        await project.deleteMany({ status: "inactive" });

        // ARCHIVE INACTIVE MASTERS
        const inactiveMasters = await master.find({ status: "inactive" });
        await masterArchives.insertMany(inactiveMasters);
        await master.deleteMany({ status: "inactive" });

        // ARCHIVE INACTIVE COMPANIES
        const inactiveCompanies = await company.find({ status: "inactive" });
        await companyArchives.insertMany(inactiveCompanies);
        await company.deleteMany({ status: "inactive" });

        // ARCHIVE INACTIVE APP CONFIGS
        const inactiveAppConfigs = await appConfig.find({ status: "inactive" });
        await appConfigArchives.insertMany(inactiveAppConfigs);
        await appConfig.deleteMany({ status: "inactive" });

        // ARCHIVE INACTIVE PLAYER CONFIGS
        const inactivePlayerConfigs = await playerConfig.find({
          status: "inactive",
        });
        await playerConfigArchives.insertMany(inactivePlayerConfigs);
        await playerConfig.deleteMany({ status: "inactive" });

        // ARCHIVE INACTIVE CUSTOM CONFIGS
        const inactiveCustomConfigs = await customConfig.find({
          status: "inactive",
        });
        await customConfigArchives.insertMany(inactiveCustomConfigs);
        await customConfig.deleteMany({ status: "inactive" });

        console.log(`Cron Job Ended ${new Date()}`);
      } catch (error) {
        console.log(error.message);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );

  console.log(`Archive Jobs Queued at ${new Date()}`);
};
