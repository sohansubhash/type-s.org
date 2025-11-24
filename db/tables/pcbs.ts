import { defineTable, column } from "astro:db";
import { partColumns } from "./part";

export const Pcbs = defineTable({
  columns: {
    ...partColumns,
    supports_bluetooth: column.boolean(),
    layout: column.text(),
    connector_type: column.text({ optional: true }),
  },
});
