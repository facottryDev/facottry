import mongoose from "mongoose";

const playerConfigArchiveSchema = new mongoose.Schema(
  {
    configID: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    desc: {
      type: String
    },

    type: {
      type: String,
      default: "player",
    },

    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive"],
    },

    projectID: {
      type: String,
      required: true,
    },

    companyID: {
      type: String,
      required: true,
    },

    params: {
      type: Object,
    },

    createdBy: {
      type: String,
    },

    lastModifiedBy: {
      type: String,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: '30d' // 30 days
    }
  },
  { timestamps: true }
);

export default mongoose.model.archiveplayerconfigs ||
mongoose.model("archiveplayerconfig", playerConfigArchiveSchema);
