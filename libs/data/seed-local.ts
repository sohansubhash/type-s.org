#!/usr/bin/env node
import { getPlatformProxy } from "wrangler";
import { seed } from "./seed.js";

async function main() {
  const { env } = await getPlatformProxy();

  if (!env.DB) {
    throw new Error("DB binding not found. Make sure wrangler.toml is configured.");
  }

  await seed(env.DB);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
