import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { manufacturers } from '../manufacturers';
import { partColumns } from './part';

export const sliders = sqliteTable('sliders', {
  ...partColumns(manufacturers),
  // Slider-specific fields
  type: text('type').notNull(),
  silenced: integer('silenced', { mode: 'boolean' }).notNull(),
});
