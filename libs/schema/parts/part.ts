import { integer, text } from 'drizzle-orm/sqlite-core';

/**
 * Shared columns for all keyboard part tables
 * (PCBs, Controllers, Plates, Domes, Sliders, Springs, Cases)
 */
export function partColumns(manufacturersTable: any) {
  return {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    manufacturer_id: integer('manufacturer_id').references(() => manufacturersTable.id).notNull(),
    url: text('url'),
    release_date: integer('release_date', { mode: 'timestamp' }),
    notes: text('notes'),
  };
}
