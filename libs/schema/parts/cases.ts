import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { manufacturers } from '../manufacturers';
import { partColumns } from './part';

export const cases = sqliteTable('cases', {
  ...partColumns(manufacturers),
  // Case-specific fields
  color: text('color').notNull(),
  material: text('material').notNull(),
});
