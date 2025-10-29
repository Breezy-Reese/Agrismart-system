import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

// Connect to MongoDB
connectDB().catch((err) => {
  console.error("❌ Database connection failed:", err.message);
  process.exit(1);
});

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // allow frontend or all origins
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" })); // to handle large M-Pesa callback payloads

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("🌾 AgriSmart Backend API is running ✅");
});

// ✅ Callback verification endpoints
app.get("/api/orders/mpesa-callback", (req, res) => {
  res.send("✅ M-Pesa callback GET endpoint active");
});

app.post("/api/orders/mpesa-callback", (req, res) => {
  console.log("📥 M-Pesa callback test POST received:", req.body);
  res.status(200).send("Callback received");
});

// 404 handler (optional)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Server setup
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ M-Pesa Callback URL: ${BASE_URL}/api/orders/mpesa-callback`);
});
