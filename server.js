import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import auth from "./api/auth.js";
import chat from "./api/chat.js";
import docs from "./api/docs.js";
import memory from "./api/memory.js";
import briefing from "./api/briefing.js";
import push from "./api/push.js";
import cron from "./api/cron.js";

const app = express();
const pub = path.join(path.dirname(fileURLToPath(import.meta.url)), "public");

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

app.use(
  express.static(pub, {
    setHeaders: (res, file) => { if (file.endsWith("sw.js")) res.setHeader("Cache-Control", "no-cache"); },
  })
);

// JSON errors (e.g. malformed or oversized request bodies)
app.use((err, req, res, next) => res.status(err.status || 500).json({ error: err.message || "Server error" }));

app.listen(process.env.PORT || 3000, "0.0.0.0", () => console.log("Astra running"));
