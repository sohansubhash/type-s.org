import { defineTable, column } from "astro:db";
import { partColumns } from "./part";

export const Controllers = defineTable({
  columns: {
    ...partColumns,
    supports_bluetooth: column.boolean(),
    firmware: column.text({ optional: true }),
  },
});
