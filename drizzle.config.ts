import type { Config } from "drizzle-kit";
import path from "path";
import fs from "fs";

const getLocalD1 = () => {
  try {
    const basePath = path.resolve(".wrangler");
    const dbFile = fs
      .readdirSync(basePath, { encoding: "utf-8", recursive: true })
      .find((f) => f.endsWith(".sqlite"));

    if (!dbFile) {
      throw new Error(`.sqlite file not found in ${basePath}`);
    }

    const url = path.resolve(basePath, dbFile);
    return url;
  } catch (err) {
    console.log(`Local D1 not found, will be created on first migration: ${err}`);
    return ":memory:";
  }
};

export default {
  out: "./drizzle/migrations",
  schema: "./libs/schema/**/*.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: getLocalD1(),
  },
} satisfies Config;
