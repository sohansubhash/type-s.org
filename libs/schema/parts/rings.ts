import { sqliteTable } from "drizzle-orm/sqlite-core";
import { manufacturers } from "../manufacturers";
import { partColumns } from "./part";

export const rings = sqliteTable("rings", {
  ...partColumns(manufacturers),
});
