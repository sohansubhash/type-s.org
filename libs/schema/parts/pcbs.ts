import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { manufacturers } from '../manufacturers';
import { partColumns } from './part';

export const pcbs = sqliteTable('pcbs', {
  ...partColumns(manufacturers),
  // PCB-specific fields
  supports_bluetooth: integer('supports_bluetooth', { mode: 'boolean' }).notNull(),
  layout: text('layout').notNull(),
  connector_type: text('connector_type'),
});
