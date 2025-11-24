import { defineTable, column } from "astro:db";
import { Pcbs } from "../pcbs";
import { Plates } from "../plates";

export const PcbPlateCompatibility = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    pcb_id: column.number({ references: () => Pcbs.columns.id }),
    plate_id: column.number({ references: () => Plates.columns.id }),
    notes: column.text({ optional: true }),
  },
});
