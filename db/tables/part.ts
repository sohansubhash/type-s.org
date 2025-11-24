import { column } from "astro:db";
import { Manufacturers } from "./manufacturers";

/**
 * Shared columns for all keyboard part tables
 * (PCBs, Controllers, Plates, Domes, Sliders, Springs, Cases)
 */
export const partColumns = {
  id: column.number({ primaryKey: true }),
  name: column.text(),
  manufacturer_id: column.number({ references: () => Manufacturers.columns.id }),
  url: column.text({ optional: true }),
  release_date: column.date({ optional: true }),
  notes: column.text({ optional: true }),
};
