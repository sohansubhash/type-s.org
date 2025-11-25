#!/usr/bin/env node
/**
 * Generate SQL INSERT statements from JSON data files
 * This creates a seed.sql file that can be executed with:
 * wrangler d1 execute type-s-db --local --file seed.sql
 */

import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function loadJSONFiles(dirName: string) {
  const dirPath = path.join(__dirname, dirName);
  const files = await readdir(dirPath);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  const data = await Promise.all(
    jsonFiles.map(async (file) => {
      const content = await readFile(path.join(dirPath, file), "utf-8");
      return JSON.parse(content);
    })
  );

  return data;
}

function escapeSQL(value: any): string {
  if (value === null || value === undefined) {
    return "NULL";
  }
  if (typeof value === "number") {
    return value.toString();
  }
  if (typeof value === "boolean") {
    return value ? "1" : "0";
  }
  // Escape single quotes by doubling them
  return `'${String(value).replace(/'/g, "''")}'`;
}

function generateInsert(tableName: string, data: any[]): string[] {
  const statements: string[] = [];

  for (const row of data) {
    const columns = Object.keys(row);
    const values = columns.map((col) => escapeSQL(row[col]));

    statements.push(
      `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${values.join(", ")});`
    );
  }

  return statements;
}

async function main() {
  console.log("🔨 Generating seed.sql from JSON data...");

  const sqlStatements: string[] = [];

  sqlStatements.push("-- Seed data generated from JSON files");
  sqlStatements.push("-- Order matters due to foreign key constraints\n");

  // 1. Manufacturers (no dependencies)
  console.log("📦 Processing manufacturers...");
  const manufacturers = await loadJSONFiles("manufacturers");
  sqlStatements.push("-- Manufacturers");
  sqlStatements.push(...generateInsert("manufacturers", manufacturers));
  sqlStatements.push("");

  // 2. All parts (depend on manufacturers)
  console.log("🔧 Processing parts...");

  const parts = [
    { name: "pcbs", table: "pcbs" },
    { name: "controllers", table: "controllers" },
    { name: "plates", table: "plates" },
    { name: "domes", table: "domes" },
    { name: "sliders", table: "sliders" },
    { name: "springs", table: "springs" },
    { name: "rings", table: "rings" },
    { name: "housings", table: "housings" },
    { name: "sb-stabs", table: "sb_stabs" },
    { name: "wires", table: "wires" },
    { name: "cases", table: "cases" },
  ];

  for (const part of parts) {
    const data = await loadJSONFiles(part.name);
    sqlStatements.push(`-- ${part.name}`);
    sqlStatements.push(...generateInsert(part.table, data));
    sqlStatements.push("");
  }

  // 3. Models (depend on parts)
  console.log("⌨️  Processing models...");
  const models = await loadJSONFiles("models");
  sqlStatements.push("-- Models");
  sqlStatements.push(...generateInsert("hhkb_models", models));

  const sql = sqlStatements.join("\n");
  const outputPath = path.join(__dirname, "seed.sql");
  await writeFile(outputPath, sql, "utf-8");

  console.log(`✅ Generated seed.sql with ${sqlStatements.length} lines`);
  console.log(`📍 Location: ${outputPath}`);
  console.log("\nRun with: pnpm db:seed:local");
}

main().catch((err) => {
  console.error("❌ Failed to generate seed.sql:", err);
  process.exit(1);
});
