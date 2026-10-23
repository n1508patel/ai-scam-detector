import Scan from "../models/Scan.js";
import { runRules } from "../services/ruleService.js";
import { analyzeWithAI } from "../services/aiService.js";

function verdictFromScore(score) {
  if (score >= 70) return "scam";
  if (score >= 35) return "suspicious";
  return "safe";
}

export async function scanMessage(req, res) {
  const text = (req.body.text || "").trim();

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }
  if (text.length > 3000) {
    return res.status(400).json({ error: "Text is too long (max 3000 characters)" });
  }

  const rules = runRules(text);

  let ai = null;
  try {
    ai = await analyzeWithAI(text);
  } catch (err) {
    console.error("AI analysis failed, falling back to rules only:", err.message);
  }

  // AI gets 70% weight, rules get 30%. If AI fails, use rules only.
  const score = ai ? Math.round(ai.score * 0.7 + rules.score * 0.3) : rules.score;
  const redFlags = [...new Set([...(ai?.redFlags || []), ...rules.redFlags])];
  const advice =
    ai?.advice || "Do not click any links and never share your OTP or PIN with anyone.";

  const scan = await Scan.create({
    user: req.user?._id || null,
    input: text,
    verdict: verdictFromScore(score),
    score,
    redFlags,
    advice,
    aiUsed: Boolean(ai),
  });

  res.json({
    id: scan._id,
    verdict: scan.verdict,
    score: scan.score,
    redFlags: scan.redFlags,
    advice: scan.advice,
    aiUsed: Boolean(ai),
  });
}
export async function getHistory(req, res) {
  const scans = await Scan.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({ scans });
}

export async function deleteScan(req, res) {
  const scan = await Scan.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!scan) {
    return res.status(404).json({ error: "Scan not found" });
  }

  res.json({ message: "Scan deleted" });
}
export async function getStats(req, res) {
  const [totals, topFlags] = await Promise.all([
    Scan.aggregate([
      { $group: { _id: "$verdict", count: { $sum: 1 } } },
    ]),
    Scan.aggregate([
      { $unwind: "$redFlags" },
      { $group: { _id: "$redFlags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
  ]);

  const byVerdict = { scam: 0, suspicious: 0, safe: 0 };
  totals.forEach((t) => { byVerdict[t._id] = t.count; });
  const totalScans = byVerdict.scam + byVerdict.suspicious + byVerdict.safe;

  res.json({
    totalScans,
    byVerdict,
    topRedFlags: topFlags.map((f) => ({ flag: f._id, count: f.count })),
  });
}