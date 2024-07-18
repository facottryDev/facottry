import mongoose from "mongoose";

const projectArchivesSchema = new mongoose.Schema(
  {
    projectID: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      default: "PROD",
      enum: ["PROD", "UAT", "DEV", "TEST"],
    },

    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive"],
    },

    companyID: {
      type: String,
      required: true,
    },

    filters: {
      type: Object,
      default: {}
    },

    configTypes: {
      type: Array,
      default: ['app', 'player']
    },

    joinRequests: [
      {
        type: String,
        expiresAt: {
          type: Date,
          default: Date.now() + 30 * 24 * 60 * 60 * 1000, // 1 month expiration
        },
      }
    ],

    activeInvites: [
      {
        type: String,
        expiresAt: {
          type: Date,
          default: Date.now() + 30 * 24 * 60 * 60 * 1000, // 1 month expiration
        },
      }
    ],

    owners: [
      {
        type: String,
        required: true,
      }
    ],

    editors: [
      {
        type: String,
        trim: true,
      }
    ],

    viewers: [
      {
        type: String,
        trim: true,
      }
    ],

    createdAt: {
      type: Date,
      default: Date.now,
      expires: '30d'
    }
  },
  { timestamps: true }
);

export default mongoose.model.archiveprojects ||
mongoose.model("archiveproject", projectArchivesSchema);
