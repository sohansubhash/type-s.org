import { defineTable, column } from "astro:db";
import { partColumns } from "./part";

export const Springs = defineTable({
  columns: {
    ...partColumns,
  },
});
