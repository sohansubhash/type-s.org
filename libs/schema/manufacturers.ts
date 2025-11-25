import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const manufacturers = sqliteTable('manufacturers', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  url: text('url'),
  country: text('country'),
  established: text('established'),
});
