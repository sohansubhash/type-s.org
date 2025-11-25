import { drizzle } from "drizzle-orm/d1";
import * as schema from "@type-s/schema";
import { readdir, readFile } from "fs/promises";
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

export async function seed(db: D1Database) {
  const drizzleDb = drizzle(db, { schema, casing: 'snake_case' });

  console.log("🌱 Seeding database...");

  // Order matters due to foreign key constraints
  // 1. Manufacturers first (no dependencies)
  console.log("📦 Seeding manufacturers...");
  const manufacturers = await loadJSONFiles("manufacturers");
  for (const manufacturer of manufacturers) {
    await drizzleDb
      .insert(schema.manufacturers)
      .values(manufacturer)
      .onConflictDoUpdate({
        target: schema.manufacturers.id,
        set: manufacturer,
      });
  }

  // 2. All parts (depend on manufacturers)
  console.log("🔧 Seeding parts...");

  const pcbs = await loadJSONFiles("pcbs");
  for (const pcb of pcbs) {
    await drizzleDb
      .insert(schema.pcbs)
      .values(pcb)
      .onConflictDoUpdate({
        target: schema.pcbs.id,
        set: pcb,
      });
  }

  const controllers = await loadJSONFiles("controllers");
  for (const controller of controllers) {
    await drizzleDb
      .insert(schema.controllers)
      .values(controller)
      .onConflictDoUpdate({
        target: schema.controllers.id,
        set: controller,
      });
  }

  const plates = await loadJSONFiles("plates");
  for (const plate of plates) {
    await drizzleDb
      .insert(schema.plates)
      .values(plate)
      .onConflictDoUpdate({
        target: schema.plates.id,
        set: plate,
      });
  }

  const domes = await loadJSONFiles("domes");
  for (const dome of domes) {
    await drizzleDb
      .insert(schema.domes)
      .values(dome)
      .onConflictDoUpdate({
        target: schema.domes.id,
        set: dome,
      });
  }

  const sliders = await loadJSONFiles("sliders");
  for (const slider of sliders) {
    await drizzleDb
      .insert(schema.sliders)
      .values(slider)
      .onConflictDoUpdate({
        target: schema.sliders.id,
        set: slider,
      });
  }

  const springs = await loadJSONFiles("springs");
  for (const spring of springs) {
    await drizzleDb
      .insert(schema.springs)
      .values(spring)
      .onConflictDoUpdate({
        target: schema.springs.id,
        set: spring,
      });
  }

  const rings = await loadJSONFiles("rings");
  for (const ring of rings) {
    await drizzleDb
      .insert(schema.rings)
      .values(ring)
      .onConflictDoUpdate({
        target: schema.rings.id,
        set: ring,
      });
  }

  const housings = await loadJSONFiles("housings");
  for (const housing of housings) {
    await drizzleDb
      .insert(schema.housings)
      .values(housing)
      .onConflictDoUpdate({
        target: schema.housings.id,
        set: housing,
      });
  }

  const sbStabs = await loadJSONFiles("sb-stabs");
  for (const sbStab of sbStabs) {
    await drizzleDb
      .insert(schema.sbStabs)
      .values(sbStab)
      .onConflictDoUpdate({
        target: schema.sbStabs.id,
        set: sbStab,
      });
  }

  const wires = await loadJSONFiles("wires");
  for (const wire of wires) {
    await drizzleDb
      .insert(schema.wires)
      .values(wire)
      .onConflictDoUpdate({
        target: schema.wires.id,
        set: wire,
      });
  }

  const cases = await loadJSONFiles("cases");
  for (const caseData of cases) {
    await drizzleDb
      .insert(schema.cases)
      .values(caseData)
      .onConflictDoUpdate({
        target: schema.cases.id,
        set: caseData,
      });
  }

  // 3. Models last (depend on parts)
  console.log("⌨️  Seeding models...");
  const models = await loadJSONFiles("models");
  for (const model of models) {
    await drizzleDb
      .insert(schema.hhkbModels)
      .values(model)
      .onConflictDoUpdate({
        target: schema.hhkbModels.id,
        set: model,
      });
  }

  console.log("✅ Database seeded successfully!");
}
