const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;

// Only allow the published ASTRA 2 website to call this API.
// Add another exact origin to ASTRA_ORIGINS if you later use a custom domain.
const allowedOrigins = (
  process.env.ASTRA_ORIGINS ||
  "https://pankitmandal4414-cpu.github.io"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // Requests without an Origin header (for example, health checks) are allowed.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);
app.use(express.json({ limit: "10kb" }));

app.use(
  "/api/",
  rateLimit({
    windowMs: 60 * 1000,
    limit: 60,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { ok: false, error: "Too many requests. Please try again shortly." }
  })
);

app.get("/", (_req, res) => {
  res.json({
    name: "ASTRA 2 API",
    status: "online",
    message: "Backend is running. AI provider is not connected yet."
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "astra-2-backend",
    status: "online",
    aiConnected: false,
    timestamp: new Date().toISOString()
  });
});

// Safe placeholder endpoint. It does not call an AI provider or store messages.
app.post("/api/chat", (req, res) => {
  const message =
    typeof req.body?.message === "string" ? req.body.message.trim() : "";

  if (!message || message.length > 1000) {
    return res.status(400).json({
      ok: false,
      error: "Message must contain between 1 and 1000 characters."
    });
  }

  return res.status(501).json({
    ok: false,
    mode: "setup",
    error: "The secure API is online, but the AI provider has not been connected yet."
  });
});

app.use((err, _req, res, _next) => {
  if (err.message === "Origin not allowed by CORS") {
    return res.status(403).json({ ok: false, error: "This website origin is not allowed." });
  }
  console.error("Server error:", err.message);
  return res.status(500).json({ ok: false, error: "Internal server error." });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ASTRA 2 API listening on port ${PORT}`);
});
