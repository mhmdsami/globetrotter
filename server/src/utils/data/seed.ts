import fs from "fs";
import path from "path";
import { db } from "../db.js";

async function main() {
  console.log("Seeding data");

  const data = fs
    .readFileSync(
      path.join(path.resolve(), "src", "utils", "data", "seed.json"),
    )
    .toString();
  const destinations = JSON.parse(data) as Array<{
    city: string;
    country: string;
    clues: string[];
    fun_fact: string[];
    trivia: string[];
  }>;

  for await (const destination of destinations) {
    await db.destination.create({
      data: {
        name: destination.city,
        country: destination.country,
        clues: destination.clues,
        funFacts: destination.fun_fact,
        trivia: destination.trivia,
      },
    });
  }

  console.log("Data seeded");
}

main().catch(console.error);
