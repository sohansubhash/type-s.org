import { defineTable, column } from "astro:db";
import { partColumns } from "./part";

export const Plates = defineTable({
  columns: {
    ...partColumns,
    material: column.text(),
    integrated: column.boolean(),
  },
});
