import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { manufacturers } from '../manufacturers';
import { partColumns } from './part';

export const domes = sqliteTable('domes', {
  ...partColumns(manufacturers),
  // Dome-specific fields
  weight: text('weight').notNull(),
  type: text('type').notNull(),
  material: text('material').notNull(),
});
