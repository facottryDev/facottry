import mongoose from "mongoose";

const masterArchiveSchema = new mongoose.Schema(
  {
    projectID: {
      type: String,
      required: true,
    },

    companyID: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive"],
    },

    filter: {
      type: Object,
      required: true,
    },

    appConfig: {
      configID: {
        type: String,
      },

      name: {
        type: String,
        required: true,
      },

      desc: {
        type: String,
      },

      params: {
        type: Object,
      },
    },
    
    playerConfig: {
      configID: {
        type: String,
      },
  
      name: {
        type: String,
        required: true,
      },
  
      desc: {
        type: String
      },
  
      params: {
        type: Object,
      },
    },

    customConfigs: {
      type: Object,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: '30d'
    }
  },
  { timestamps: true }
);

export default mongoose.model.archivemappings || mongoose.model("archivemapping", masterArchiveSchema);
