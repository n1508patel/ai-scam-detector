import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, maxlength: 2000 },
    category: {
      type: String,
      enum: ["kyc", "lottery", "job", "upi", "courier", "otp", "other"],
      default: "other",
    },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);