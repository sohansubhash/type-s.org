import { defineTable, column } from "astro:db";
import { partColumns } from "./part";

export const Domes = defineTable({
  columns: {
    ...partColumns,
    weight: column.text(),
    type: column.text(),
    material: column.text(),
  },
});
