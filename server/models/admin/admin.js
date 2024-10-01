import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Provide Email"],
      unique: [true, "Email already exists"],
      validate: {
        validator: function (value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: "Invalid email format",
      },
    },

    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive"],
    },

    name: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      default: "admin",
      enum: ["admin", "superadmin"],
    },

    companyID: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model.admins || mongoose.model("admin", userSchema);
