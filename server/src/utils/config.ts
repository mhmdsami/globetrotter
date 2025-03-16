import "dotenv/config";
import { z } from "zod";

const configSchema = z.object({
  PORT: z.string().default("8000").transform(Number),
  DATABASE_URL: z.string().default("mongodb://localhost:27017/globetrotter"),
  JWT_SECRET: z.string().default("secret"),
});

export const { PORT, DATABASE_URL, JWT_SECRET } = configSchema.parse(
  process.env,
);
