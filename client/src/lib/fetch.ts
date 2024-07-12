"use client";
import { axios_admin, axios_config } from "@/lib/axios";

export const fetchConfigs = async (projectID: string | undefined) => {
  if (projectID === undefined) {
    return { appConfigs: [], playerConfigs: [] };
  }

  try {
    const appConfigs = await axios_config.get("/get-app-configs", {
      params: { projectID },
    });
    const playerConfigs = await axios_config.get("/get-player-configs", {
      params: { projectID },
    });

    return { appConfigs: appConfigs.data, playerConfigs: playerConfigs.data };
  } catch (error: any) {
    return error.response;
  }
};

export const fetchProjectByID = async (projectID: string) => {
  try {
    const project = await axios_admin.get("/get-project-details", {
      params: { projectID },
    });

    return project;
  } catch (error: any) {
    return error.response;
  }
};
