import { defineTable, column } from "astro:db";
import { Pcbs } from "../pcbs";
import { Controllers } from "../controllers";

export const PcbControllerCompatibility = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    pcb_id: column.number({ references: () => Pcbs.columns.id }),
    controller_id: column.number({ references: () => Controllers.columns.id }),
    notes: column.text({ optional: true }),
  },
});
