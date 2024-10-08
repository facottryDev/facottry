import mongoose from "mongoose";

const customConfigArchiveSchema = new mongoose.Schema(
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

    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive"],
    },

    type: {
        type: String,
        required: true,
    },

    desc: {
      type: String
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

export default mongoose.model.archivecustomconfigs ||
  mongoose.model("archivecustomconfig", customConfigArchiveSchema);
