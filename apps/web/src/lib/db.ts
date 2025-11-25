import { drizzle } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';
import * as schema from '@type-s/schema';

/**
 * Get a Drizzle database instance from Cloudflare context
 * Usage in Astro pages:
 *
 * const db = getDb(Astro.locals.runtime.env.DB);
 * const pcbs = await db.select().from(schema.pcbs);
 */
export function getDb(d1: D1Database) {
  return drizzle(d1, { schema, casing: 'snake_case' });
}

/**
 * Type for the database instance
 */
export type Database = ReturnType<typeof getDb>;
