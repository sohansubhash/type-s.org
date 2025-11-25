import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { manufacturers } from '../manufacturers';
import { partColumns } from './part';

export const plates = sqliteTable('plates', {
  ...partColumns(manufacturers),
  // Plate-specific fields
  material: text('material').notNull(),
  integrated: integer('integrated', { mode: 'boolean' }).notNull(),
});
