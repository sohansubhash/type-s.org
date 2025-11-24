import { defineTable, column } from "astro:db";
import { partColumns } from "./part";

export const Cases = defineTable({
  columns: {
    ...partColumns,
    color: column.text(),
    material: column.text(),
  },
});
