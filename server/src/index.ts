import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { rateLimiter } from "hono-rate-limiter";
import * as router from "./routes/index.js";
import { PORT } from "./utils/config.js";

const app = new Hono().basePath("/api");

app.use(logger());
app.use(cors());
app.use(
  rateLimiter({
    windowMs: 60 * 1000,
    limit: 60,
    standardHeaders: "draft-6",
    keyGenerator: (c) => "<unique_key>",
  })
);

app.get("/", (c) => {
  return c.json({ message: "Welcome to Globetrotter API" });
});

app.get("/healthcheck", (c) => {
  return c.json({ status: "ok", uptime: process.uptime() });
});

app.route("/user", router.user);

app.notFound((c) => c.json({ success: false, message: "Not Found" }, 404));
app.onError((err, c) => {
  console.error(err);
  return c.json({ success: false, error: "Internal Server Error" }, 500);
});

serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
