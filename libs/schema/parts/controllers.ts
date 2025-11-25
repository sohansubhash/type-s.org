import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { manufacturers } from '../manufacturers';
import { partColumns } from './part';

export const controllers = sqliteTable('controllers', {
  ...partColumns(manufacturers),
  // Controller-specific fields
  supports_bluetooth: integer('supports_bluetooth', { mode: 'boolean' }).notNull(),
  firmware: text('firmware'),
});
