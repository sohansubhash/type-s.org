import { defineTable, column } from "astro:db";

export const Manufacturers = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    url: column.text({ optional: true }),
    country: column.text({ optional: true }),
    established: column.text({ optional: true }),
  },
});
