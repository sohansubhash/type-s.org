import { integer, text } from 'drizzle-orm/sqlite-core';

/**
 * Shared columns for all keyboard board tables
 */
export function boardColumns(manufacturersTable: any) {
  return {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    layout: text('layout').notNull(),
    release_date: integer('release_date', { mode: 'timestamp' }),
    manufacturer_id: integer('manufacturer_id').references(() => manufacturersTable.id).notNull(),
  };
}
