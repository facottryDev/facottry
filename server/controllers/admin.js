import { generateID, sendMail } from "../lib/helpers.js";
import Company from "../models/admin/company.js";
import Project from "../models/admin/project.js";
import AppConfig from "../models/configs/appConfig.js";
import PlayerConfig from "../models/configs/playerConfig.js";
import CustomConfig from "../models/configs/customConfig.js";
import Master from "../models/scale/master.js";
import Contact from "../models/admin/contact.js";

// UPDATE CONTACT MESSAGES
export const updateContacts = async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    // check if email exists
    const contact = await Contact.findOne({
      email,
    });

    if (!contact) {
      const newContact = new Contact({
        email,
        messages: [{ subject, message }],
      });

      await newContact.save();
      return res.status(200).json({ message: "Message sent successfully" });
    } else {
      contact.messages.push({ subject, message });
      await contact.save();
      return res.status(200).json({ message: "Message sent successfully" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

// GET ADMIN INFO
export const getAdmin = async (req, res) => {
  try {
    const email = req.session.username || req.user.email;

    const company = await Company.findOne({
      status: "active",
      $or: [{ owners: email }, { employees: email }],
    });

    const projects = await Project.find({
      status: "active",
      $or: [{ owners: email }, { editors: email }, { viewers: email }],
    });

    if (!company) {
      return res.status(403).json({
        code: "NO_COMPANY",
        message: "You are not part of any company",
      });
    }

    const companyDetails = {
      companyID: company.companyID,
      name: company.name,
      address: company.address,
      role: company.owners.includes(email) ? "owner" : "employee",
      joinRequests: company.owners.includes(email) ? company.joinRequests : [],
      activeInvites: company.owners.includes(email)
        ? company.activeInvites
        : [],
      owners: company.owners,
      employees: company.owners.includes(email) ? company.employees : [],
    };

    if (!projects.length) {
      return res.status(403).json({
        code: "NO_PROJECT",
        message: "You are not part of any project",
        company: companyDetails,
      });
    }

    const projectDetails = projects.map((project) => ({
      projectID: project.projectID,
      name: project.name,
      type: project.type,
      configTypes: project.configTypes,
      role: project.owners.includes(email)
        ? "owner"
        : project.editors.includes(email)
        ? "editor"
        : "viewer",
      joinRequests: project.owners.includes(email) ? project.joinRequests : [],
      activeInvites: project.owners.includes(email)
        ? project.activeInvites
        : [],
      owners: project.owners,
      editors: project.owners.includes(email) ? project.editors : [],
      viewers: project.owners.includes(email) ? project.viewers : [],
      filters: project.filters,
    }));

    return res
      .status(200)
      .json({ company: companyDetails, projects: projectDetails });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ADD COMPANY - COMPANY OWNER
export const addCompany = async (req, res) => {
  try {
    const { name, address } = req.body;
    const email = req.session.username || req.user.email;

    // Check if company already exists
    const companyExists = await Company.findOne({
      status: "active",
      owners: { $in: [email] },
    });

    if (companyExists) {
      return res.status(400).json({
        message: "A Company already exists under this email",
        companyID: companyExists.companyID,
      });
    }

    // Create new company
    const companyID = generateID(name);

    const newCompany = new Company({
      companyID,
      name,
      address,
      owners: [email],
    });

    const company = await newCompany.save();

    const companyDetails = {
      companyID: company.companyID,
      name: company.name,
      address: company.address,
      role: company.owners.includes(email) ? "owner" : "employee",
      joinRequests: company.owners.includes(email) ? company.joinRequests : [],
      activeInvites: company.owners.includes(email)
        ? company.activeInvites
        : [],
      owners: company.owners.includes(email) ? company.owners : [],
      employees: company.employees.includes(email) ? company.employees : [],
    };

    // Add Demo Project & Configs*************

    // NETFLIX DEMO PROJECT
    const netflixProjectID = generateID("NETFLIX_DEMO");
    const netflixProject = new Project({
      projectID: netflixProjectID,
      name: "NETFLIX_DEMO",
      type: "TEST",
      companyID: company.companyID,
      owners: [email],
      filters: {
        COUNTRY: { default: "IN", values: ["IN", "US"] },
        SUBSCRIPTION: {
          default: "FREE",
          values: ["FREE", "PAID"],
        },
      },
    });

    await netflixProject.save();

    // NETFLIX APP CONFIG
    const netflixAppConfig = new AppConfig({
      configID: generateID(`app_NETFLIX_DEMO`),
      projectID: netflixProjectID,
      companyID: company.companyID,
      name: "NETFLIX_APP 1.0",
      type: "app",
      desc: "App Config for Netflix",
      params: {
        headerLogoSection: {
          headerMainLogo: true,
          headerUserLogo: true,
        },
        heroSection: {
          heroSectionBackgroundImageAndDetalisSection: true,
        },
        movieSection: {
          allMovieSection: true,
        },
      },
      createdBy: email,
      lastModifiedBy: email,
    });

    await netflixAppConfig.save();

    // NETFLIX PLAYER CONFIG
    const netflixPlayerConfig = new PlayerConfig({
      configID: generateID(`player_NETFLIX_DEMO`),
      projectID: netflixProjectID,
      companyID: company.companyID,
      name: "NETFLIX_PLAYER 1.0",
      type: "player",
      desc: "Player Config for Netflix",
      params: {},
      createdBy: email,
      lastModifiedBy: email,
    });

    await netflixPlayerConfig.save();

    // NETFLIX DEFAULT MAPPING
    const netflixMapping = new Master({
      appConfig: netflixAppConfig,
      playerConfig: netflixPlayerConfig,
      customConfig: {},
      filter: {
        COUNTRY: "IN",
        SUBSCRIPTION: "FREE",
      },
      projectID: netflixProjectID,
      companyID,
    });

    await netflixMapping.save();

    // HOTSAR DEMO PROJECT
    const hotstarProjectID = generateID("HOTSTAR_DEMO");
    const hotstarProject = new Project({
      projectID: hotstarProjectID,
      name: "HOTSTAR_DEMO",
      type: "TEST",
      companyID: company.companyID,
      owners: [email],
      filters: {
        COUNTRY: { default: "IN", values: ["IN", "US"] },
        SUBSCRIPTION: {
          default: "FREE",
          values: ["FREE", "PAID"],
        },
      },
    });

    await hotstarProject.save();

    // HOTSTAR APP CONFIG
    const hotstarAppConfig = new AppConfig({
      configID: generateID(`app_HOTSTAR_DEMO`),
      projectID: hotstarProjectID,
      companyID: company.companyID,
      name: "HOTSTAR_APP 1.0",
      type: "app",
      desc: "App Config for Hotstar",
      params: {
        header: {
          headerMainlogo: true,
          loginButton: true,
        },
        silderbarImages: {
          heroImages: true,
        },
        animationVideoSection: {
          animationVideosStop: true,
          animationVideoSectionHide: true,
        },

        movieSection: {
          recommendsForYouMovieSection: true,
          originalMovieSection: true,
          trendingMovieSection: true,
          newDisneyMovieSection: true,
        },
        movieDetailSection: {
          detailPageBackGroundimage: true,
          detailPageTitle: true,
          detailPagePlayButton: true,
          detailPageTrailerButton: true,
          detailPageSubtitle: true,
          detailPageDescription: true,
        },
      },
      createdBy: email,
      lastModifiedBy: email,
    });

    await hotstarAppConfig.save();

    // HOTSTAR PLAYER CONFIG
    const hotstarPlayerConfig = new PlayerConfig({
      configID: generateID(`player_HOTSTAR_DEMO`),
      projectID: hotstarProjectID,
      companyID: company.companyID,
      name: "HOTSTAR_PLAYER 1.0",
      type: "player",
      desc: "Player Config for Hotstar",
      params: {
        playVideo: true,
        videoUrl: "/videos/insideout2.mp4",
        controls: true,
        width: "100%",
        height: "100%",
        volume: 0.8,
      },
      createdBy: email,
      lastModifiedBy: email,
    });

    await hotstarPlayerConfig.save();

    // HOTSTAR DEFAULT MAPPING
    const hotstarMapping = new Master({
      appConfig: hotstarAppConfig,
      playerConfig: hotstarPlayerConfig,
      customConfig: {},
      filter: {
        COUNTRY: "IN",
        SUBSCRIPTION: "FREE",
      },
      projectID: hotstarProjectID,
      companyID,
    });

    await hotstarMapping.save();

    // APNECK DEMO PROJECT
    const apneckProjectID = generateID("APNECK_DEMO");
    const apneckProject = new Project({
      projectID: apneckProjectID,
      name: "APNECK_DEMO",
      type: "TEST",
      companyID: company.companyID,
      owners: [email],
      filters: {
        COUNTRY: { default: "IN", values: ["IN", "US"] },
        SUBSCRIPTION: {
          default: "FREE",
          values: ["FREE", "PAID"],
        },
      },
    });

    await apneckProject.save();

    // APNECK APP CONFIG
    const apneckAppConfig = new AppConfig({
      configID: generateID(`app_APNECK_DEMO`),
      projectID: apneckProjectID,
      companyID: company.companyID,
      name: "APNECK_APP 1.0",
      type: "app",
      desc: "App Config for Apneck",
      params: {
        header: {
          headerMainLogo: true,
        },
        navbarButtons: {
          homeButton: true,
          shopButton: true,
          blogButton: true,
          aboutButton: true,
          contactButton: true,
        },
        heroSection: {
          heroSectionBannerImage: true,
          iconsFastOrderOnlineOrderetc: true,
        },
        homePageInfeaturedProductSection: {
          featuredProduct4ImagesSection: true,
        },
        homePageInnewArrivals: {
          newArrivals4ImagesSection: true,
        },
        shopButtonProductImages: {
          shopButtonProductAllImages: true,
        },
        blogButton: {
          blogPageSection: true,
        },
        aboutButton: {
          blogPageSection: true,
        },
      },
      createdBy: email,
      lastModifiedBy: email,
    });

    await apneckAppConfig.save();

    // APNECK PLAYER CONFIG
    const apneckPlayerConfig = new PlayerConfig({
      configID: generateID(`player_APNECK_DEMO`),
      projectID: apneckProjectID,
      companyID: company.companyID,
      name: "APNECK_PLAYER 1.0",
      type: "player",
      desc: "Player Config for Apneck",
      params: {},
      createdBy: email,
      lastModifiedBy: email,
    });

    await apneckPlayerConfig.save();

    // APNECK DEFAULT MAPPING
    const apneckMapping = new Master({
      appConfig: apneckAppConfig,
      playerConfig: apneckPlayerConfig,
      customConfig: {},
      filter: {
        COUNTRY: "IN",
        SUBSCRIPTION: "FREE",
      },
      projectID: apneckProjectID,
      companyID,
    });

    await apneckMapping.save();

    return res
      .status(200)
      .json({ message: "Company added successfully", company: companyDetails });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// DEACTIVATE COMPANY - COMPANY OWNER
export const deactivateCompany = async (req, res) => {
  try {
    const owner = req.session.username || req.user.email;

    const company = await Company.findOne({
      status: "active",
      owners: { $in: [owner] },
    });

    // Check if company exists
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Update the status of all projects under the company and return projectIDs
    await Project.updateMany(
      { status: "active", companyID: company.companyID },
      { status: "inactive" }
    );

    // Update the status of all appConfigs under the company
    await AppConfig.updateMany(
      { status: "active", companyID: company.companyID },
      { status: "inactive" }
    );

    // Update the status of all playerConfigs under the company
    await PlayerConfig.updateMany(
      { status: "active", companyID: company.companyID },
      { status: "inactive" }
    );

    // Update the status of all customConfigs under the company
    await CustomConfig.updateMany(
      { status: "active", companyID: company.companyID },
      { status: "inactive" }
    );

    // Update the status of all masters under the company
    await Master.updateMany(
      { status: "active", companyID: company.companyID },
      { status: "inactive" }
    );

    // Update the status of the company
    company.status = "inactive";
    await company.save();

    res.status(200).json({ message: "Company deactivated successfully" });
  } catch (error) {
    return res.status(500).send(error);
  }
};

// UPDATE COMPANY - COMPANY OWNER
export const updateCompanyDetails = async (req, res) => {
  try {
    const owner = req.session.username || req.user.email;
    const { name, address } = req.body;

    const company = await Company.findOne({
      status: "active",
      owners: { $in: [owner] },
    });

    // Check if company exists
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Update the company details
    company.name = name;
    company.address = address;
    await company.save();

    res.status(200).json({ message: "Company updated successfully" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// DELETE EMPLOYEE FROM COMPANY - COMPANY OWNER
export const deleteCompanyUser = async (req, res) => {
  try {
    const owner = req.session.username || req.user.email;
    const { email } = req.body;

    const company = await Company.findOne({
      status: "active",
      owners: { $in: [owner] },
    });

    console.log(company);

    // Check if company exists
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if user exists in the company
    if (!company.employees.includes(email)) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update Company document
    company.employees = company.employees.filter(
      (employee) => employee !== email
    );
    await company.save();

    // Update Project document
    await Project.updateMany(
      { status: "active", companyID: company.companyID },
      {
        $pull: {
          owners: email,
          editors: email,
          viewers: email,
          joinRequests: email,
          activeInvites: email,
        },
      }
    );

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

//ADD PROJECT - COMPANY OWNER
export const addProject = async (req, res) => {
  try {
    const { name, type } = req.body;
    const owner = req.session.username || req.user.email;

    const projectID = generateID(name);

    // Check if user is owner of the company
    const company = await Company.findOne({
      status: "active",
      owners: { $in: [owner] },
    });

    if (!company) {
      return res
        .status(404)
        .json({ message: "No company found under this email" });
    }

    // Check if project already exists
    const projectExists = await Project.findOne({
      status: "active",
      companyID: company.companyID,
      name,
      type,
    });

    if (projectExists) {
      return res.status(409).json({
        message: "A project with same configuration already exists",
        projectID: projectExists.projectID,
      });
    }

    // Add default filters
    const filters = {
      COUNTRY: { default: "IN", values: ["IN"] },
      SUBSCRIPTION: { default: "FREE", values: ["FREE"] },
    };

    // Create new project
    const newProject = new Project({
      projectID,
      name,
      type,
      companyID: company.companyID,
      owners: [owner],
      filters,
    });

    await newProject.save();

    res.status(200).json({ message: "Project added successfully" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

//DEACTIVATE PROJECT - PROJECT OWNER
export const deactivateProject = async (req, res) => {
  try {
    const owner = req.session.username || req.user.email;
    const { projectID } = req.body;

    const project = await Project.findOne({
      status: "active",
      projectID,
      owners: { $in: [owner] },
    });

    // Check if project exists
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update the status of all appConfigs under the company
    await AppConfig.updateMany(
      { status: "active", projectID },
      { status: "inactive" }
    );

    // Update the status of all playerConfigs under the company
    await PlayerConfig.updateMany(
      { status: "active", projectID },
      { status: "inactive" }
    );

    // Update the status of all customConfigs under the company
    await CustomConfig.updateMany(
      { status: "active", projectID },
      { status: "inactive" }
    );

    // Update the status of all masters under the company
    await Master.updateMany(
      { status: "active", projectID },
      { status: "inactive" }
    );

    // Update the status of the project
    project.status = "inactive";
    await project.save();

    res.status(200).json({ message: "Project deactivated successfully" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// UPDATE PROJECT - PROJECT OWNER
export const updateProjectDetails = async (req, res) => {
  try {
    const owner = req.session.username || req.user.email;
    const { companyID, projectID, name, type } = req.body;

    const projectExists = await Project.findOne({
      status: "active",
      companyID,
      name,
      type,
    });

    if (projectExists) {
      return res.status(409).json({
        message:
          "A project with same configuration already exists in the company",
      });
    }

    const project = await Project.findOne({ status: "active", projectID });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.owners.includes(owner)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    project.name = name;
    project.type = type;
    await project.save();

    res.status(200).json({ message: "Project updated successfully" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// DELETE USER FROM PROJECT - PROJECT OWNER
export const deleteProjectUser = async (req, res) => {
  try {
    const owner = req.session.username || req.user.email;
    const { email, projectID } = req.body;

    const project = await Project.findOne({
      status: "active",
      projectID,
      owners: { $in: [owner] },
    });

    // Check if project exists
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user exists in the project
    if (
      !project.owners.includes(email) &&
      !project.editors.includes(email) &&
      !project.viewers.includes(email)
    ) {
      return res.status(404).json({ message: "User not found in project" });
    }

    if (project.owners.includes(email) && project.owners.length === 1) {
      return res.status(400).json({
        message:
          "You are the only owner of this project. Transfer ownership before leaving.",
      });
    }

    // Update Project document
    project.owners = project.owners.filter((owner) => owner !== email);
    project.editors = project.editors.filter((editor) => editor !== email);
    project.viewers = project.viewers.filter((viewer) => viewer !== email);
    await project.save();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// CHANGE ACCESS RIGHT OF USER IN PROJECT - PROJECT OWNER
export const changeAccessProject = async (req, res) => {
  try {
    const owner = req.session.username || req.user.email;
    const { email, projectID, role } = req.body;

    const project = await Project.findOne({
      status: "active",
      projectID,
      owners: { $in: [owner] },
    });

    // Check if project exists
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user exists in the project
    if (
      !project.owners.includes(email) &&
      !project.editors.includes(email) &&
      !project.viewers.includes(email)
    ) {
      return res.status(404).json({ message: "User not found in project" });
    }

    if (project.owners.includes(email) && project.owners.length === 1) {
      return res.status(400).json({
        message:
          "You are the only owner of this project. Make someone else owner before changing.",
      });
    }

    // Update Project document
    project.owners = project.owners.filter((owner) => owner !== email);
    project.editors = project.editors.filter((editor) => editor !== email);
    project.viewers = project.viewers.filter((viewer) => viewer !== email);

    role === "owner" && project.owners.push(email);
    role === "editor" && project.editors.push(email);
    role === "viewer" && project.viewers.push(email);

    await project.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// CHANGE ACCESS RIGHT OF USER IN COMPANY - COMPANY OWNER
export const changeAccessCompany = async (req, res) => {
  try {
    const owner = req.session.username || req.user.email;
    const { email, role } = req.body;

    const company = await Company.findOne({
      status: "active",
      owners: { $in: [owner] },
    });

    // Check if company exists
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    console.log(company.owners.includes(email));

    // Check if user exists in the company
    if (!company.employees.includes(email) && !company.owners.includes(email)) {
      return res.status(404).json({ message: "User not found in company" });
    }

    if (company.owners.includes(email) && company.owners.length === 1) {
      return res.status(400).json({
        message:
          "You are the only owner of this company. Make someone else owner before changing.",
      });
    }

    // Update Company document
    company.owners = company.owners.filter((owner) => owner !== email);
    company.employees = company.employees.filter(
      (employee) => employee !== email
    );

    role === "owner" && company.owners.push(email);
    role === "employee" && company.employees.push(email);

    await company.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// CREATE A JOIN REQUEST TO COMPANY - USER
export const createJoinCompanyRequest = async (req, res) => {
  try {
    const email = req.session.username || req.user.email;
    const { companyID } = req.body;

    // Check if user is already part of a company
    const isAdmin = await Company.findOne({
      status: "active",
      $or: [{ owners: email }, { employees: email }],
    });

    if (isAdmin)
      return res.status(400).json({
        message: "You are already part of a company",
        companyID: isAdmin.companyID,
        role: isAdmin.owners.includes(email) ? "owner" : "employee",
      });

    // Check if the companyID exists
    const company = await Company.findOne({ status: "active", companyID });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if user has already sent a request
    if (company.joinRequests.includes(email))
      return res.status(400).json({ message: "Request already exists" });

    // Update Company document
    company.joinRequests.push(email);
    await company.save();

    res.status(200).json({ message: "Request sent successfully" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// ACCEPT JOIN REQUEST TO COMPANY - COMPANY OWNER
export const acceptJoinCompanyRequest = async (req, res) => {
  try {
    const owner = req.session.username || req.user.email;
    const { email, role } = req.body;

    console.log(role)

    const company = await Company.findOne({
      status: "active",
      owners: { $in: [owner] },
    });

    // Check if company exists
    if (!company) {
      return res.status(404).json({ message: "You don't own any company" });
    }

    // Check if user has sent a request
    if (!company.joinRequests.includes(email)) {
      return res.status(404).json({ message: "No request found from user" });
    }

    const isAdmin = await Company.findOne({
      status: "active",
      $or: [{ owners: email }, { employees: email }],
    });

    if (isAdmin) {
      return res.status(400).json({
        message: "User is already part of another company",
      });
    }

    // Update Company document
    role === "owner"
      ? company.owners.push(email)
      : company.employees.push(email);

    company.joinRequests = company.joinRequests.filter(
      (request) => request !== email
    );
    await company.save();

    // Remove all join requests from user
    await Company.updateMany(
      { status: "active", joinRequests: { $in: [email] } },
      { $pull: { joinRequests: email } }
    );

    res.status(200).json({ message: "Request accepted." });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// REJECT JOIN REQUEST TO COMPANY - COMPANY OWNER
export const rejectJoinCompanyRequest = async (req, res) => {
  try {
    const owner = req.session.username || req.user.email;
    const { email } = req.body;

    const company = await Company.findOne({
      status: "active",
      owners: { $in: [owner] },
    });

    // Check if company exists
    if (!company) {
      return res.status(404).json({ message: "You don't own any company" });
    }

    // Check if user has sent a request
    if (!company.joinRequests.includes(email)) {
      return res.status(404).json({ message: "No request found from user" });
    }

    // Update Company document
    company.joinRequests = company.joinRequests.filter(
      (request) => request !== email
    );
    await company.save();

    res.status(200).json({ message: "Request rejected" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// CREATE A JOIN REQUEST TO PROJECT - ADMIN
export const createJoinProjectRequest = async (req, res) => {
  try {
    const email = req.session.username || req.user.email;
    const { projectID } = req.body;

    // Check if user is in a company
    const company = await Company.findOne({
      status: "active",
      $or: [{ owners: email }, { employees: email }],
    });

    if (!company) {
      return res.status(403).json({
        code: "NO_COMPANY",
        message: "You don't belong to any company",
      });
    }

    // Check if project exists
    const project = await Project.findOne({ status: "active", projectID });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user's company is same as project's company
    if (project.companyID !== company.companyID) {
      return res.status(403).json({
        code: "DIFFERENT_COMPANY",
        message: "This project does not belong to the your company",
      });
    }

    // Check if user is already part of the project
    if (
      project.owners.includes(email) ||
      project.editors.includes(email) ||
      project.viewers.includes(email)
    ) {
      return res.status(400).json({
        message: "You are already part of this project",
        role: project.owners.includes(email)
          ? "owner"
          : project.editors.includes(email)
          ? "editor"
          : "viewer",
      });
    }

    // Check if user has already sent a request
    if (project.joinRequests.includes(email))
      return res.status(400).json({ message: "Request already exists" });

    // Update Project document
    project.joinRequests.push(email);
    await project.save();

    res.status(200).json({ message: "Request sent successfully" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// LEAVE COMPANY - ADMIN
export const leaveCompany = async (req, res) => {
  try {
    const email = req.session.username || req.user.email;

    const company = await Company.findOne({
      status: "active",
      $or: [{ owners: email }, { employees: email }],
    });

    // Check if user is part of any company
    if (!company) {
      return res
        .status(404)
        .json({ message: "You don't belong to any company" });
    }

    // Check if user is the only owner of the company
    if (company.owners.length === 1 && company.owners.includes(email)) {
      return res.status(400).json({
        message:
          "You are the only owner of this company. Transfer ownership before leaving.",
      });
    }

    // If a project under the company has only one owner, deactivate the project
    const projects = await Project.find({
      status: "active",
      companyID: company.companyID,
    });

    for (let project of projects) {
      // if email is the only owner of project, make the editor or viewer owner else deactivate
      if (project.owners.length === 1 && project.owners.includes(email)) {
        if (project.editors.length > 0) {
          project.owners = project.editors;
          project.editors = [];
        } else if (project.viewers.length > 0) {
          project.owners = project.viewers;
          project.viewers = [];
        } else {
          project.status = "inactive";

          // Update the status of all appConfigs under the project
          await AppConfig.updateMany(
            { status: "active", projectID: project.projectID },
            { status: "inactive" }
          );

          // Update the status of all playerConfigs under the project
          await PlayerConfig.updateMany(
            { status: "active", projectID: project.projectID },
            { status: "inactive" }
          );

          // Update the status of all customConfigs under the project
          await CustomConfig.updateMany(
            { status: "active", projectID: project.projectID },
            { status: "inactive" }
          );

          // Update the status of all masters under the project
          await Master.updateMany(
            { status: "active", projectID: project.projectID },
            { status: "inactive" }
          );
        }

        await project.save();
      }
    }

    // Update Company document
    company.owners = company.owners.filter((owner) => owner !== email);
    company.employees = company.employees.filter(
      (employee) => employee !== email
    );
    await company.save();

    res.status(200).json({ message: "Success!" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// ACCEPT JOIN REQUEST TO PROJECT FROM USER - PROJECT OWNER
export const acceptJoinProjectRequest = async (req, res) => {
  try {
    const owner = req.session.username || req.user.email;
    const { email, projectID, role } = req.body;

    switch (true) {
      case !role:
        return res.status(400).json({ message: "Role not provided" });
      case !["owner", "editor", "viewer"].includes(role):
        return res.status(400).json({ message: "Invalid role" });
      case !email:
        return res.status(400).json({ message: "Email not provided" });
      case !projectID:
        return res.status(400).json({ message: "Project ID not provided" });
    }

    const project = await Project.findOne({ status: "active", projectID });

    // Check if project exists and user is owner
    switch (true) {
      case !project:
        return res.status(404).json({ message: "Project not found" });
      case !project.owners.includes(owner):
        return res.status(401).json({
          message: "Unauthorized. You are not the owner of this project",
        });
    }

    // Check if user has sent a request
    if (!project.joinRequests.includes(email)) {
      return res.status(404).json({ message: "No request found from user" });
    }

    // Update Project document
    role === "owner" && project.owners.push(email);
    role === "editor" && project.editors.push(email);
    role === "viewer" && project.viewers.push(email);
    project.joinRequests = project.joinRequests.filter(
      (request) => request !== email
    );
    await project.save();

    res.status(200).json({ message: "Request accepted" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// REJECT JOIN REQUEST TO PROJECT FROM USER - PROJECT OWNER
export const rejectJoinProjectRequest = async (req, res) => {
  try {
    const owner = req.session.username || req.user.email;
    const { email, projectID } = req.body;

    const project = await Project.findOne({ status: "active", projectID });

    // Check if project exists and user is owner
    switch (true) {
      case !project:
        return res.status(404).json({ message: "Project not found" });
      case !project.owners.includes(owner):
        return res.status(401).json({
          message: "Unauthorized. You are not the owner of this project",
        });
    }

    // Check if user has sent a request
    if (!project.joinRequests.includes(email)) {
      return res.status(404).json({ message: "No request found from user" });
    }

    // Update Project document
    project.joinRequests = project.joinRequests.filter(
      (request) => request !== email
    );
    await project.save();

    res.status(200).json({ message: "Request rejected" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// LEAVE PROJECT - ADMIN
export const leaveProject = async (req, res) => {
  try {
    const email = req.session.username || req.user.email;
    const { projectID } = req.body;

    const project = await Project.findOne({
      status: "active",
      projectID,
      $or: [{ owners: email }, { editors: email }, { viewers: email }],
    });

    // Check if project exists and user is part of it
    if (!project) {
      return res.status(404).json({ message: "No matching project" });
    }

    // Check if user is the only owner of the project
    if (project.owners.length === 1 && project.owners.includes(email)) {
      return res.status(400).json({
        message:
          "You are the only owner of this project. Transfer ownership before leaving.",
      });
    }

    // Update Project document
    project.owners = project.owners.filter((owner) => owner !== email);
    project.editors = project.editors.filter((editor) => editor !== email);
    project.viewers = project.viewers.filter((viewer) => viewer !== email);
    await project.save();

    res.status(200).json({ message: "Left project successfully" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// INVITE USER TO JOIN COMPANY - COMPANY OWNER
export const inviteUserToCompany = async (req, res) => {
  const { email } = req.body;

  try {
    const owner = req.session.username || req.user.email;

    const company = await Company.findOne({
      status: "active",
      owners: { $in: [owner] },
    });

    // Check if company exists
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if user is already part of a company
    const isAdmin = await Company.findOne({
      status: "active",
      $or: [{ owners: email }, { employees: email }],
    });

    if (isAdmin)
      return res.status(400).json({
        message: "User is already part of another company",
      });

    // Check if user is already invited
    if (company.activeInvites.includes(email))
      return res.status(400).json({ message: "User is already invited" });

    // Send email to user
    const inviteCode = generateID(`flagship_${email}_company_${company.name}`);
    const inviteLink = `${
      process.env.CLIENT_URL
    }/invite/company/${encodeURIComponent(inviteCode)}`;

    const mailOptions = {
      from: " " + process.env.EMAIL,
      to: email,
      subject: `Invitation to join ${company.name}`,
      html: `<p>You have been invited to join ${company.name}.</p>
              <p>Click <a href="${inviteLink}">here</a> to join.</p>`,
    };

    await sendMail(mailOptions);

    // Update Company document
    company.activeInvites.push(inviteCode);
    await company.save();

    res.status(200).json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
};

// VERIFY COMPANY INVITE - SYSTEM
export const verifyCompanyInvite = async (req, res) => {
  const { inviteCode } = req.query;
  const email = req.session.username || req.user.email;

  try {
    const company = await Company.findOne({
      status: "active",
      activeInvites: { $in: [inviteCode] },
    });

    if (!company) {
      return res.status(404).json({ message: "Invalid invite code" });
    }

    const invitedEmail = inviteCode.split("_")[1];
    console.log(invitedEmail);
    if (invitedEmail !== email) {
      return res.status(400).json({ message: "Email Mismatch" });
    }

    // Check if user is already part of a company
    const isAdmin = await Company.findOne({
      status: "active",
      $or: [{ owners: email }, { employees: email }],
    });

    if (isAdmin)
      return res.status(400).json({
        message: "You are already part of another company",
      });

    // Update Company document
    company.employees.push(email);
    company.activeInvites = company.activeInvites.filter(
      (invite) => invite !== inviteCode
    );
    await company.save();

    res.status(200).json({ message: "Joined company successfully" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// CANCEL COMPANY INVITE - COMPANY OWNER
export const cancelCompanyInvite = async (req, res) => {
  const { invite } = req.body;
  const owner = req.session.username || req.user.email;

  try {
    const company = await Company.findOne({
      status: "active",
      owners: { $in: [owner] },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (!company.activeInvites.includes(invite))
      return res.status(404).json({ message: "Invite not found" });

    company.activeInvites = company.activeInvites.filter(
      (activeInvite) => activeInvite !== invite
    );
    await company.save();

    res.status(200).json({ message: "Invite cancelled successfully" });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE ADMIN ACCOUNT BY CALLING LEAVE COMPANY & LEAVE PROJECT
export const deleteAdmin = async (req, res) => {
  try {
    // Leave Company
    await leaveCompany(req, res);

    // Leave All Projects
    const email = req.session.username || req.user.email;
    const projects = await Project.find({
      status: "active",
      $or: [{ owners: email }, { editors: email }, { viewers: email }],
    });

    const promises = projects.map(async (project) => {
      const body = { projectID: project.projectID };
      await leaveProject({ body }, res);
    });

    await Promise.all(promises);
    return;
  } catch (error) {
    return error;
  }
};

// ADD FILTER TO THE PROJECT - PROJECT OWNER
export const addFilter = async (req, res) => {
  try {
    const owner = req.session.username || req.user.email;
    const { projectID, filter } = req.body;

    const project = await Project.findOne({
      status: "active",
      projectID,
      owners: { $in: [owner] },
    });

    // Check if project exists
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if filter.name exist as a key in project.filters
    if (project.filters[filter.name]) {
      return res.status(409).json({ message: "Filter already exists" });
    }

    // if default value is not present in values, add it
    if (!filter.values.includes(filter.default)) {
      filter.values.push(filter.default);
    }

    // update all previous mappings of the project with the new filter and its default value
    await Master.updateMany(
      { status: "active", projectID },
      { $set: { [`filter.${filter.name}`]: filter.default } }
    );

    // Add filter to project
    project.filters[filter.name] = {
      default: filter.default,
      values: filter.values,
    };

    project.markModified("filters");
    await project.save();

    res.status(200).json({ message: "Filter added successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }
};

// UPDATE A FILTER OF THE FILTERS OF A PROJECT - PROJECT OWNER
export const updateFilter = async (req, res) => {
  try {
    const owner = req.session.username || req.user.email;
    const { projectID, filter } = req.body;

    const project = await Project.findOne({
      status: "active",
      projectID,
      owners: { $in: [owner] },
    });

    // Check if project exists
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if filter exists
    const filterExists = Object.keys(project.filters).includes(filter.name);

    if (!filterExists) {
      return res.status(404).json({ message: "Filter not found" });
    }

    // Update filter details
    project.filters[filter.name] = {
      default: filter.default,
      values: filter.values,
    };

    project.markModified("filters");

    await project.save();
    res.status(200).json({ message: "Filter updated successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }
};

// DELETE A FILTER FROM THE FILTERS OF A PROJECT - PROJECT OWNER
export const deleteFilter = async (req, res) => {
  try {
    const owner = req.session.username || req.user.email;
    const { projectID, filterName } = req.body;

    const project = await Project.findOne({
      status: "active",
      projectID,
      owners: { $in: [owner] },
    });

    // Check if project exists
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if filter exists
    if (!project.filters || !project.filters[filterName]) {
      return res.status(404).json({ message: "Filter not found" });
    }

    // Remove filter from filters object
    delete project.filters[filterName];
    project.markModified("filters");
    await project.save();

    // Remove filter key from all masters of the project
    await Master.updateMany(
      { status: "active", projectID },
      { $unset: { [`filter.${filterName}`]: "" } }
    );

    res.status(200).json({ message: "Filter deleted successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }
};

// CLONE PROJECT - PROJECT OWNER
export const cloneProject = async (req, res) => {
  try {
    const owner = req.session.username || req.user.email;
    const { projectID, name } = req.body;

    const project = await Project.findOne({
      status: "active",
      projectID,
      owners: { $in: [owner] },
    });

    // Check if project exists
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if project with same name exists
    const projectExists = await Project.findOne({
      status: "active",
      companyID: project.companyID,
      name,
    });

    if (projectExists) {
      return res.status(409).json({
        message: "A project with same name already exists in the company",
      });
    }

    // Clone project
    const clonedProject = new Project({
      projectID: generateID(name),
      name,
      type: project.type,
      companyID: project.companyID,
      owners: [owner],
      filters: project.filters,
    });

    await clonedProject.save();

    // Clone appConfigs, playerConfigs and masters from the original project
    const appConfigs = await AppConfig.find({
      status: "active",
      projectID,
    });

    const playerConfigs = await PlayerConfig.find({
      status: "active",
      projectID,
    });

    const masters = await Master.find({
      status: "active",
      projectID,
    });

    const promises = appConfigs.map(async (appConfig) => {
      const clonedAppConfig = new AppConfig({
        ...appConfig.toObject(),
        projectID: clonedProject.projectID,
      });
      await clonedAppConfig.save();
    });

    await Promise.all(promises);

    const promises2 = playerConfigs.map(async (playerConfig) => {
      const clonedPlayerConfig = new PlayerConfig({
        ...playerConfig.toObject(),
        projectID: clonedProject.projectID,
      });
      await clonedPlayerConfig.save();
    });

    await Promise.all(promises2);

    const promises3 = masters.map(async (master) => {
      const clonedMaster = new Master({
        ...master.toObject(),
        projectID: clonedProject.projectID,
      });
      await clonedMaster.save();
    });

    await Promise.all(promises3);
    res.status(200).json({ message: "Project cloned successfully" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// ADD NEW CONFIG TYPE - PROJECT OWNER
export const addConfigType = async (req, res) => {
  try {
    const owner = req.session.username || req.user.email;
    const { projectID, config } = req.body;

    switch (true) {
      case !config:
        return res.status(400).json({ message: "Config details not provided" });
      case !config.name:
        return res.status(400).json({ message: "Config name not provided" });
    }

    const project = await Project.findOne({
      status: "active",
      projectID,
      owners: { $in: [owner] },
    });

    // Check if project exists
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if the name already exists
    const typeExists = project.configTypes.find(
      (type) => type.name === config.name
    );

    if (typeExists) {
      return res.status(409).json({ message: "Type already exists" });
    }

    // Add type to project
    project.configTypes.push({
      name: config.name,
      desc: config.desc || "",
      status: config.status || "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    project.markModified("configTypes");
    await project.save();

    res.status(200).json({ message: "Config type added successfully" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export const deleteConfigType = async (req, res) => {
  try {
    const { projectID, name } = req.query;
    const user = req.session.username || req.user.email;

    const project = await Project.findOne({
      status: "active",
      projectID,
      owners: { $in: [user] },
    });

    // Check if project exists
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if type exists
    const typeExists = project.configTypes.find((type) => type.name === name);

    if (!typeExists) {
      return res.status(404).json({ message: "Type not found" });
    }

    // remove type from project
    project.configTypes = project.configTypes.filter(
      (type) => type.name !== name
    );
    project.markModified("configTypes");
    await project.save();

    // remove the type from customConfigs of all masters
    await Master.updateMany(
      { status: "active", projectID },
      { $unset: { [`customConfigs.${name}`]: "" } }
    );

    res.status(200).json({ message: "Type deleted successfully" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getProject = async (req, res) => {
  try {
    const owner = req.session.username || req.user.email;
    const { projectID } = req.query;

    const project = await Project.findOne({
      status: "active",
      projectID,
      owners: { $in: [owner] },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// INVITE USER TO JOIN PROJECT - PROJECT OWNER
export const inviteUserToProject = async (req, res) => {
  const { email, projectID } = req.body;

  try {
    const owner = req.session.username || req.user.email;

    // Check if project exists
    const project = await Project.findOne({
      status: "active",
      projectID,
      owners: { $in: [owner] },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is already part of the project
    if (
      project.owners.includes(email) ||
      project.editors.includes(email) ||
      project.viewers.includes(email)
    ) {
      return res.status(400).json({
        message: "User is already part of this project",
        role: project.owners.includes(email)
          ? "owner"
          : project.editors.includes(email)
          ? "editor"
          : "viewer",
      });
    }

    // Check if user is already invited
    if (project.activeInvites.includes(email))
      return res.status(400).json({ message: "User is already invited" });

    // Send email to user
    const inviteCode = generateID(`flagship_${email}_${project.name}`);
    const inviteLink = `${
      process.env.CLIENT_URL
    }/invite/project/${encodeURIComponent(inviteCode)}`;

    const mailOptions = {
      from: " " + process.env.EMAIL,
      to: email,
      subject: `Invitation to join ${project.name}`,
      html: `<p>You have been invited to join ${project.name}.</p>
              <p>Click <a href="${inviteLink}">here</a> to join.</p>`,
    };

    await sendMail(mailOptions);

    // Update Project document
    project.activeInvites.push(inviteCode);
    await project.save();

    res.status(200).json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }
};

// VERIFY PROJECT INVITE - SYSTEM
export const verifyProjectInvite = async (req, res) => {
  const { inviteCode } = req.query;
  const email = req.session.username || req.user.email;

  try {
    const project = await Project.findOne({
      status: "active",
      activeInvites: { $in: [inviteCode] },
    });

    if (!project) {
      return res.status(404).json({ message: "Invalid invite code" });
    }

    const invitedEmail = inviteCode.split("_")[1];
    if (invitedEmail !== email) {
      return res.status(400).json({ message: "Email Mismatch" });
    }

    // Check if user is already part of the project
    if (
      project.owners.includes(email) ||
      project.editors.includes(email) ||
      project.viewers.includes(email)
    ) {
      return res.status(400).json({
        message: "You are already part of this project",
        role: project.owners.includes(email)
          ? "owner"
          : project.editors.includes(email)
          ? "editor"
          : "viewer",
      });
    }

    // Check user's company
    const company = await Company.findOne({
      status: "active",
      $or: [{ owners: email }, { employees: email }],
    });

    if (company && company.companyID !== project.companyID) {
      return res
        .status(400)
        .json({ message: "You are already a part of a different company" });
    }

    if (!company) {
      const projectCompany = await Company.findOne({
        status: "active",
        companyID: project.companyID,
      });

      if (projectCompany) {
        projectCompany.employees.push(email);
        await projectCompany.save();
      } else {
        return res.status(404).json({ message: "Project Company not found" });
      }
    }

    // Update Project document
    project.viewers.push(email);
    project.activeInvites = project.activeInvites.filter(
      (invite) => invite !== inviteCode
    );
    await project.save();

    res.status(200).json({ message: "Joined project successfully" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// CANCEL PROJECT INVITE - PROJECT OWNER
export const cancelProjectInvite = async (req, res) => {
  const { invite } = req.body;
  const owner = req.session.username || req.user.email;

  try {
    const project = await Project.findOne({
      status: "active",
      owners: { $in: [owner] },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.activeInvites.includes(invite))
      return res.status(404).json({ message: "Invite not found" });

    project.activeInvites = project.activeInvites.filter(
      (activeInvite) => activeInvite !== invite
    );
    await project.save();

    res.status(200).json({ message: "Invite cancelled successfully" });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
