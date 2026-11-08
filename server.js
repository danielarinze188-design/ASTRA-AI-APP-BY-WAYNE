import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import auth from "./auth.js";
import chat from "./chat.js";
import docs from "./docs.js";
import memory from "./memory.js";
import briefing from "./briefing.js";
import push from "./push.js";
import cron from "./cron.js";

const app = express();
const root = path.dirname(fileURLToPath(import.meta.url));
const FILES = new Set(["index.html", "sw.js", "manifest.json", "logo.png", "icon-192.png", "icon-512.png", "icon-maskable-512.png"]);

app.set("trust proxy", 1);
app.use(express.json({ limit: "6mb" }));

const wrap = (h) => (req, res) =>
  Promise.resolve(h(req, res)).catch((e) => {
    if (!res.headersSent) res.status(500).json({ error: String(e.message || e) });
    else res.end();
  });

app.get("/health", (req, res) => res.send("ok"));
app.all("/api/auth", wrap(auth));
app.all("/api/chat", wrap(chat));
app.all("/api/docs", wrap(docs));
app.all("/api/memory", wrap(memory));
app.all("/api/briefing", wrap(briefing));
app.all("/api/push", wrap(push));
app.all("/api/cron", wrap(cron));

// Only these files are public; server code is never served.
app.get("/", (req, res) => res.sendFile(path.join(root, "index.html")));
app.get("/:file", (req, res, next) => {
  if (!FILES.has(req.params.file)) return next();
  if (req.params.file === "sw.js") res.setHeader("Cache-Control", "no-cache");
  res.sendFile(path.join(root, req.params.file));
});
app.use((req, res, next) => (req.path.startsWith("/api/") ? next() : res.status(404).send("Not found")));

// JSON errors (e.g. malformed or oversized request bodies)
app.use((err, req, res, next) => res.status(err.status || 500).json({ error: err.message || "Server error" }));

app.listen(process.env.PORT || 3000, "0.0.0.0", () => console.log("Astra running"));
