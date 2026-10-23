import mongoose from "mongoose";

const scanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    input: { type: String, required: true },
    verdict: { type: String, enum: ["scam", "suspicious", "safe"], required: true },
    score: { type: Number, min: 0, max: 100, required: true },
    redFlags: [String],
    advice: String,
    aiUsed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Scan", scanSchema);