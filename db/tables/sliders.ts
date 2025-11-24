import { defineTable, column } from "astro:db";
import { partColumns } from "./part";

export const Sliders = defineTable({
  columns: {
    ...partColumns,
    type: column.text(),
    silenced: column.boolean(),
  },
});
