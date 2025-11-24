import { defineTable, column } from "astro:db";
import { Pcbs } from "../pcbs";
import { Cases } from "../cases";

export const PcbCaseCompatibility = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    pcb_id: column.number({ references: () => Pcbs.columns.id }),
    case_id: column.number({ references: () => Cases.columns.id }),
    notes: column.text({ optional: true }),
  },
});
