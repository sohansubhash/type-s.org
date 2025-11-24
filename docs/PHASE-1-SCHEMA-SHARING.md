# Phase 1: Schema Sharing with Drizzle

## Why Drizzle?

Astro DB is actually **built on top of Drizzle ORM**. This means you can use Drizzle schema definitions directly, and they work seamlessly with both:
- Astro DB (for your website)
- Direct Turso connections (for your Discord bot)

## How Drizzle Works with Both Projects

### Current Setup (Astro DB)
```typescript
// db/tables/pcbs.ts
import { defineTable, column } from "astro:db";

export const Pcbs = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
  },
});
```

### Drizzle Equivalent
```typescript
// db/schema/pcbs.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const pcbs = sqliteTable('pcbs', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
});
```

**Key difference:** Drizzle schemas can be used by ANY project that connects to the database, not just Astro.

---

## Monorepo Structure (Recommended)

```
type-s.org/
├── packages/
│   ├── schema/                    # Shared schemas
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── index.ts          # Re-exports all schemas
│   │   │   ├── tables/
│   │   │   │   ├── pcbs.ts
│   │   │   │   ├── controllers.ts
│   │   │   │   └── manufacturers.ts
│   │   │   └── types.ts          # Inferred TypeScript types
│   │   └── tsconfig.json
│   │
│   ├── website/                   # Astro site
│   │   ├── package.json
│   │   ├── astro.config.mjs
│   │   └── src/
│   │       └── pages/
│   │
│   └── discord-bot/               # Cloudflare Worker
│       ├── package.json
│       ├── wrangler.toml
│       └── src/
│           └── index.ts
│
├── pnpm-workspace.yaml            # Defines workspace
├── package.json                   # Root package.json
└── turbo.json                     # Optional: Turborepo for builds
```

---

## Setup Steps

### 1. Initialize Monorepo

**pnpm-workspace.yaml:**
```yaml
packages:
  - 'packages/*'
```

**Root package.json:**
```json
{
  "name": "type-s-monorepo",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev:site": "pnpm --filter website dev",
    "dev:bot": "pnpm --filter discord-bot dev"
  }
}
```

### 2. Create Schema Package

**packages/schema/package.json:**
```json
{
  "name": "@type-s/schema",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {
    "drizzle-orm": "^0.29.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

**packages/schema/src/index.ts:**
```typescript
// Export all tables
export * from './tables/manufacturers';
export * from './tables/pcbs';
export * from './tables/controllers';
export * from './tables/domes';
export * from './tables/sliders';
export * from './tables/springs';
export * from './tables/cases';
export * from './tables/plates';

// Export types
export * from './types';
```

**packages/schema/src/tables/manufacturers.ts:**
```typescript
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const manufacturers = sqliteTable('manufacturers', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  url: text('url'),
  country: text('country'),
  established: text('established'),
});
```

**packages/schema/src/tables/pcbs.ts:**
```typescript
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { manufacturers } from './manufacturers';

export const pcbs = sqliteTable('pcbs', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  manufacturer_id: integer('manufacturer_id').references(() => manufacturers.id),
  url: text('url'),
  release_date: integer('release_date', { mode: 'timestamp' }),
  notes: text('notes'),
  // PCB-specific fields
  supports_bluetooth: integer('supports_bluetooth', { mode: 'boolean' }).notNull(),
  layout: text('layout').notNull(),
  connector_type: text('connector_type'),
});
```

**packages/schema/src/types.ts:**
```typescript
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import * as schema from './index';

// Select types (for reading)
export type Manufacturer = InferSelectModel<typeof schema.manufacturers>;
export type PCB = InferSelectModel<typeof schema.pcbs>;
export type Controller = InferSelectModel<typeof schema.controllers>;

// Insert types (for writing)
export type NewManufacturer = InferInsertModel<typeof schema.manufacturers>;
export type NewPCB = InferInsertModel<typeof schema.pcbs>;
export type NewController = InferInsertModel<typeof schema.controllers>;
```

### 3. Use in Astro Website

**packages/website/package.json:**
```json
{
  "name": "website",
  "dependencies": {
    "@type-s/schema": "workspace:*",
    "@astrojs/db": "latest",
    "astro": "latest",
    "drizzle-orm": "^0.29.0"
  }
}
```

**packages/website/db/config.ts:**
```typescript
import { defineDb } from 'astro:db';
import * as schema from '@type-s/schema';

// Astro DB can use Drizzle schemas directly
export default defineDb({
  tables: schema,
});
```

**packages/website/src/pages/pcbs/index.astro:**
```astro
---
import { db } from 'astro:db';
import { pcbs, manufacturers } from '@type-s/schema';
import { eq } from 'drizzle-orm';

const allPcbs = await db
  .select()
  .from(pcbs)
  .leftJoin(manufacturers, eq(pcbs.manufacturer_id, manufacturers.id));
---

<ul>
  {allPcbs.map(({ pcbs, manufacturers }) => (
    <li>{pcbs.name} by {manufacturers?.name}</li>
  ))}
</ul>
```

### 4. Use in Discord Bot

**packages/discord-bot/package.json:**
```json
{
  "name": "discord-bot",
  "dependencies": {
    "@type-s/schema": "workspace:*",
    "@libsql/client": "latest",
    "discord.js": "latest",
    "drizzle-orm": "^0.29.0"
  }
}
```

**packages/discord-bot/src/db.ts:**
```typescript
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@type-s/schema';

// Direct connection to Turso
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, { schema });
```

**packages/discord-bot/src/commands/add-pcb.ts:**
```typescript
import { db } from '../db';
import { pcbs, type NewPCB } from '@type-s/schema';

export async function handleAddPcb(interaction: CommandInteraction) {
  const pcbData: NewPCB = {
    name: interaction.options.getString('name')!,
    manufacturer_id: interaction.options.getInteger('manufacturer_id')!,
    layout: interaction.options.getString('layout')!,
    supports_bluetooth: interaction.options.getBoolean('bluetooth')!,
    // ... other fields
  };

  // Full type safety! TypeScript knows all the fields
  const [newPcb] = await db.insert(pcbs).values(pcbData).returning();

  await interaction.reply(`Added PCB: ${newPcb.name}`);
}
```

---

## Benefits of This Approach

### 1. Single Source of Truth
- One schema definition
- Used by both Astro and Discord bot
- Changes automatically sync

### 2. Full Type Safety
```typescript
import { type PCB, type NewPCB } from '@type-s/schema';

// TypeScript knows all fields
const pcb: PCB = {
  id: 1,
  name: 'HHKB PCB',
  // ... TypeScript will error if you miss required fields
};
```

### 3. No Publishing Needed
- Workspace protocol: `"@type-s/schema": "workspace:*"`
- Local package, no npm publish
- Can publish later if needed

### 4. Works with Turso
- Drizzle has native libSQL support
- Both projects can connect to same database
- Astro uses it for builds
- Bot uses it for live updates

---

## Migration from Current Setup

### Option 1: Keep Astro DB, Generate Types
- Keep your current `db/config.ts`
- Use `astro db generate` to create types
- Export types for Discord bot
- Bot uses types but connects directly to Turso

**Pros:** No migration needed
**Cons:** Bot doesn't share actual schema, just types

### Option 2: Convert to Drizzle (Recommended)
- Convert each table from Astro DB format to Drizzle
- Move to shared schema package
- Both projects use same schemas

**Pros:** True single source of truth
**Cons:** Need to convert existing schemas

---

## Comparison: Astro DB vs Drizzle Syntax

| Feature | Astro DB | Drizzle |
|---------|----------|---------|
| Integer | `column.number()` | `integer('name')` |
| Text | `column.text()` | `text('name')` |
| Boolean | `column.boolean()` | `integer('name', { mode: 'boolean' })` |
| Date | `column.date()` | `integer('name', { mode: 'timestamp' })` |
| Primary Key | `column.number({ primaryKey: true })` | `integer('name').primaryKey()` |
| Foreign Key | `column.number({ references: () => table.columns.id })` | `integer('name').references(() => table.id)` |
| Optional | `column.text({ optional: true })` | `text('name')` (nullable by default) |
| Required | `column.text()` | `text('name').notNull()` |

---

## Next Steps

**Choose your path:**

**Path A: Quick Start (Keep Astro DB)**
1. Export types from Astro DB
2. Discord bot uses types only
3. Validate data before submitting

**Path B: Full Migration (Recommended)**
1. Set up monorepo structure
2. Create `@type-s/schema` package
3. Convert tables to Drizzle format
4. Update Astro to use shared schemas
5. Build Discord bot with shared schemas

Which approach do you want to take?
