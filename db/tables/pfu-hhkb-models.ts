import { defineTable, column } from "astro:db";
import { Pcbs } from "./pcbs";
import { Controllers } from "./controllers";
import { Domes } from "./domes";
import { Sliders } from "./sliders";

export const PFU_HHKB_Models = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    model_number: column.text({ unique: true }),
    model_name: column.text(),
    layout: column.text(),
    case_color: column.text(),
    keycap_color: column.text(),
    legends: column.text(),
    release_date: column.date({ optional: true }),
    generation: column.text(), // e.g., "Classic", "Professional 2", "Hybrid", "Studio"
    type_s: column.boolean(), // Type-S (silenced) variant
    notes: column.text({ optional: true }),
    // Foreign keys to core components
    pcb_id: column.number({ references: () => Pcbs.columns.id }),
    controller_id: column.number({ references: () => Controllers.columns.id }),
    dome_id: column.number({
      optional: true,
      references: () => Domes.columns.id,
    }),
    slider_id: column.number({
      optional: true,
      references: () => Sliders.columns.id,
    }),
  },
});
