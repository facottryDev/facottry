import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  messages: [
    {
      subject: String,
      message: String,
    }
  ],
  expiry: {
    type: Date,
    default: Date.now,
    expires : 60 * 60 * 24 * 120, // 120 days
  },
});

contactSchema.index({ expiry: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });
export default mongoose.model.contacts || mongoose.model("contact", contactSchema);