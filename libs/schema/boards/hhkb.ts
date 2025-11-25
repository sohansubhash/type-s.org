import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { manufacturers } from '../manufacturers';
import { boardColumns } from './board';
import { pcbs } from '../parts/pcbs';
import { controllers } from '../parts/controllers';
import { domes } from '../parts/domes';
import { sliders } from '../parts/sliders';

export const hhkbModels = sqliteTable('hhkb_models', {
  ...boardColumns(manufacturers),
  // HHKB-specific fields
  model_number: text('model_number').notNull().unique(),
  model_name: text('model_name').notNull(),
  case_color: text('case_color').notNull(),
  keycap_color: text('keycap_color').notNull(),
  legends: text('legends').notNull(),
  generation: text('generation').notNull(), // e.g., "Classic", "Professional 2", "Hybrid", "Studio"
  type_s: integer('type_s', { mode: 'boolean' }).notNull(), // Type-S (silenced) variant
  notes: text('notes'),
  // Foreign keys to core components
  pcb_id: integer('pcb_id').references(() => pcbs.id).notNull(),
  controller_id: integer('controller_id').references(() => controllers.id).notNull(),
  dome_id: integer('dome_id').references(() => domes.id),
  slider_id: integer('slider_id').references(() => sliders.id),
});
