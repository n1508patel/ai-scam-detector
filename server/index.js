import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import scanRoutes from "./routes/scan.js";
import authRoutes from "./routes/auth.js";
import reportRoutes from "./routes/report.js";
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => res.send("Server is running"));
app.use("/api/scan", scanRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/reports", reportRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server" });
});

await connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));