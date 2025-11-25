import { sqliteTable } from "drizzle-orm/sqlite-core";
import { manufacturers } from "../manufacturers";
import { partColumns } from "./part";

export const wires = sqliteTable("wires", {
  ...partColumns(manufacturers),
});
