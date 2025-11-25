import { sqliteTable } from "drizzle-orm/sqlite-core";
import { manufacturers } from "../manufacturers";
import { partColumns } from "./part";

export const sbStabs = sqliteTable("sb_stabs", {
  ...partColumns(manufacturers),
});
