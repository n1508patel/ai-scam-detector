import Report from "../models/Report.js";

export async function createReport(req, res) {
  const text = (req.body.text || "").trim();
  const category = req.body.category || "other";

  if (!text) {
    return res.status(400).json({ error: "Message text is required" });
  }
  if (text.length > 2000) {
    return res.status(400).json({ error: "Text is too long (max 2000 characters)" });
  }

  const report = await Report.create({
    text,
    category,
    reportedBy: req.user?._id || null,
  });

  res.status(201).json({ report });
}

export async function getReports(req, res) {
  const reports = await Report.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .select("text category createdAt");

  res.json({ reports });
}