import {
  db,
  PFU_HHKB_Models,
  Pcbs,
  Controllers,
  PcbControllerCompatibility,
} from "astro:db";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function seed() {
  // Seed PCBs from JSON
  const pcbsPath = join(__dirname, "seed-data", "pcbs", "pcbs.json");
  const pcbsContent = await readFile(pcbsPath, "utf-8");
  const pcbsData = JSON.parse(pcbsContent);
  const pcbsWithDates = pcbsData.map((pcb: any) => ({
    ...pcb,
    release_date: pcb.release_date ? new Date(pcb.release_date) : null,
  }));
  await db.insert(Pcbs).values(pcbsWithDates);

  // Seed Controllers from JSON
  const controllersPath = join(
    __dirname,
    "seed-data",
    "controllers",
    "controllers.json",
  );
  const controllersContent = await readFile(controllersPath, "utf-8");
  const controllersData = JSON.parse(controllersContent);
  await db.insert(Controllers).values(controllersData);

  // Seed PCB-Controller Compatibility
  await db.insert(PcbControllerCompatibility).values([
    {
      id: 1,
      pcb_id: 1,
      controller_id: 1,
      notes: "Stock compatibility",
    },
    {
      id: 2,
      pcb_id: 2,
      controller_id: 2,
      notes: "Stock compatibility",
    },
    {
      id: 3,
      pcb_id: 2,
      controller_id: 3,
      notes: "Aftermarket upgrade option for Bluetooth",
    },
  ]);

  // Seed PFU HHKB Models from JSON files by generation
  const generations = ["pro-1", "professional-2", "classic", "hybrid"];

  for (const generation of generations) {
    const filePath = join(
      __dirname,
      "seed-data",
      "models",
      `${generation}.json`,
    );
    const fileContent = await readFile(filePath, "utf-8");
    const models = JSON.parse(fileContent);

    // Convert date strings to Date objects
    const modelsWithDates = models.map((model: any) => ({
      ...model,
      release_date: model.release_date ? new Date(model.release_date) : null,
    }));

    await db.insert(PFU_HHKB_Models).values(modelsWithDates);
  }

  console.log("Database seeded successfully!");
}
