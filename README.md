# Type-S.org

A comprehensive database and documentation platform for HHKB (Happy Hacking Keyboard) parts, models, and specifications. Built with a schema-first, monorepo architecture.

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    type-s-monorepo                          │
│                                                             │
│  ┌──────────────┐     ┌──────────────┐     ┌────────────┐ │
│  │  @type-s/    │────▶│  @type-s/    │────▶│ Cloudflare │ │
│  │   schema     │     │    data      │     │     D1     │ │
│  │              │     │              │     │            │ │
│  │ • Tables     │     │ • JSON data  │     │ • SQLite   │ │
│  │ • Types      │     │ • Seed logic │     │ • Shared   │ │
│  │ • Relations  │     │ • Seed SQL   │     │   instance │ │
│  └──────┬───────┘     └──────────────┘     └─────┬──────┘ │
│         │                                          │        │
│         │                                          │        │
│         ├──────────────────────┬───────────────────┤        │
│         │                      │                   │        │
│  ┌──────▼──────┐        ┌──────▼──────┐          │        │
│  │  apps/web   │        │  apps/bot   │          │        │
│  │             │        │             │          │        │
│  │ • Astro app │        │ • Discord   │          │        │
│  │ • CF Pages  │        │ • CF Worker │          │        │
│  │ • Reads D1  │        │ • Reads D1  │          │        │
│  └─────────────┘        └─────────────┘          │        │
│                                                   │        │
│  ┌────────────────────────────────────────────────┘        │
│  │ drizzle/migrations (generated from schema)             │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Core Philosophy: Separation of Concerns

The architecture follows a clear separation of concerns:

### 1. **`libs/schema`** - Source of Truth
- **What:** Drizzle ORM table definitions using TypeScript
- **Why:** Single source of truth for database structure
- **Example:**
  ```typescript
  export const controllers = sqliteTable('controllers', {
    ...partColumns(manufacturers),
    supports_bluetooth: integer('supports_bluetooth', { mode: 'boolean' }),
    firmware: text('firmware'),
  });
  ```
- **Exports:** Table definitions, TypeScript types, relationships

### 2. **`libs/data`** - Content Repository
- **What:** Structured JSON data files + seed generation
- **Why:** Separate content from structure; easy to edit, version control
- **Structure:**
  ```
  libs/data/
  ├── manufacturers/
  │   ├── pfu.json
  │   └── topre.json
  ├── controllers/
  │   └── atmega32u4.json
  └── generate-seed-sql.ts
  ```
- **Process:** JSON files → SQL INSERT statements → D1 database

### 3. **`drizzle/migrations`** - Database Migrations
- **What:** Auto-generated SQL migration files
- **Why:** Version-controlled database schema changes
- **Generated from:** `libs/schema` via `drizzle-kit generate`
- **Applied to:** Cloudflare D1 (SQLite)

### 4. **`apps/web`** - Web Application
- **What:** Astro SSR app deployed to Cloudflare Pages
- **Why:** Read-only interface for browsing parts/models
- **Key feature:** Schema-driven rendering (no hardcoded fields!)
- **Component:** `PartsList.astro` dynamically renders any table

### 5. **`apps/bot`** - Discord Bot
- **What:** Discord bot worker (future feature)
- **Why:** Provide parts lookup via Discord
- **Shares:** Same D1 database as web app

## 🗂️ Monorepo Structure

```
type-s.org/
├── apps/
│   ├── web/                      # Astro web app
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   └── PartsList.astro    # Generic schema-driven component
│   │   │   ├── pages/
│   │   │   │   ├── controllers.astro  # Just 3 lines!
│   │   │   │   ├── pcbs.astro
│   │   │   │   └── ...
│   │   │   └── lib/
│   │   │       └── db.ts              # Drizzle D1 client
│   │   └── package.json
│   │
│   └── bot/                      # Discord bot (future)
│       └── src/index.ts
│
├── libs/
│   ├── schema/                   # Database schema (SOURCE OF TRUTH)
│   │   ├── manufacturers.ts
│   │   ├── parts/
│   │   │   ├── part.ts           # Shared part columns
│   │   │   ├── controllers.ts
│   │   │   ├── pcbs.ts
│   │   │   └── ...
│   │   ├── boards/
│   │   │   ├── board.ts          # Shared board columns
│   │   │   └── hhkb.ts
│   │   └── index.ts
│   │
│   └── data/                     # Seed data (CONTENT)
│       ├── manufacturers/
│       ├── controllers/
│       ├── pcbs/
│       ├── ...
│       ├── generate-seed-sql.ts  # Converts JSON → SQL
│       └── package.json
│
├── drizzle/
│   └── migrations/               # Generated SQL migrations
│       ├── 0000_xxx.sql
│       └── meta/
│
├── wrangler.toml                 # Cloudflare config (D1, migrations)
├── drizzle.config.ts             # Drizzle Kit config
└── package.json                  # Root workspace commands
```

## 🔄 Database Workflow

### The Complete Flow

```
1. Define Schema          2. Generate Migration      3. Apply Migration
   (TypeScript)              (SQL)                      (D1 Database)

   schema/                   drizzle/                   .wrangler/
   controllers.ts ────────▶ migrations/ ────────────▶ state/d1/
                            0000_xxx.sql                *.sqlite
                                │
                                │
4. Create Seed Data       5. Generate SQL            6. Seed Database
   (JSON)                    (INSERT statements)        (D1)

   data/                     data/                       D1 ✓
   controllers/             seed.sql ───────────────▶  Tables filled
   atmega32u4.json
```

### Step-by-Step

1. **Define/Update Schema** (`libs/schema`)
   ```bash
   # Edit schema files
   vim libs/schema/parts/controllers.ts
   ```

2. **Generate Migration**
   ```bash
   pnpm db:generate
   # Creates: drizzle/migrations/0001_xxx.sql
   ```

3. **Apply Migration**
   ```bash
   pnpm db:migrate:local   # Local D1
   pnpm db:migrate:prod    # Production D1
   ```

4. **Add/Update Seed Data** (`libs/data`)
   ```bash
   # Edit JSON files
   vim libs/data/controllers/new-controller.json
   ```

5. **Seed Database**
   ```bash
   pnpm db:seed:local     # Local D1
   pnpm db:seed:prod      # Production D1
   ```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm 8+
- Cloudflare account (for production)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/type-s.org
cd type-s.org

# Install dependencies
pnpm install
```

### Initial Database Setup

```bash
# 1. Generate initial migration from schema
pnpm db:generate

# 2. Apply migration to create tables
pnpm db:migrate:local

# 3. Seed database with initial data
pnpm db:seed:local

# 4. Start development server
pnpm dev
```

Visit `http://localhost:4321`

## 📦 Key Commands

### Development

```bash
# Start web app (from root)
pnpm dev                  # or pnpm --filter web dev
pnpm dev:web             # Explicit web app
pnpm dev:bot             # Explicit bot (future)
```

### Database Management

```bash
# Generate new migration from schema changes
pnpm db:generate

# Apply migrations
pnpm db:migrate:local    # Local development database
pnpm db:migrate:prod     # Production database

# Seed database
pnpm db:seed:local       # Seed local database
pnpm db:seed:prod        # Seed production database

# Database studio (visual editor)
pnpm db:studio
```

### Building & Deployment

```bash
# Build applications
pnpm build               # Build web app
pnpm build:web          # Explicit web build
pnpm build:bot          # Explicit bot build

# Deploy (requires Cloudflare setup)
pnpm --filter web deploy
```

### Code Quality

```bash
# Format code
pnpm format              # Format all files
pnpm format:check        # Check formatting
```

## 🧩 Schema-Driven Architecture

### The Magic of Dynamic Rendering

Traditional approach (bad ❌):
```astro
<!-- Hardcoded fields -->
<li><strong>Part Number:</strong> {controller.partNumber}</li>
<li><strong>Description:</strong> {controller.description}</li>
```

**Problems:**
- Breaks when schema changes
- Fields like `partNumber` don't exist in schema
- Duplicate logic across 13+ pages

**Our approach (good ✅):**
```astro
<!-- Generic component reads schema -->
<PartsList
  tableName="controllers"
  title="HHKB Controllers"
  description="Complete list of controllers"
/>
```

**Benefits:**
- Automatically shows all columns from schema
- Add new column → Appears immediately on all pages
- Remove column → No errors, gracefully omits
- Change types → Formatting adapts automatically

### How PartsList Works

```astro
// 1. Query database
const items = await db.select().from(schema[tableName]);

// 2. Auto-fetch manufacturers
if (item.manufacturer_id) {
  item._manufacturer = await fetchManufacturer(item.manufacturer_id);
}

// 3. Dynamically render all fields
{Object.entries(item)
  .filter(([key]) => !excludeFields.includes(key))
  .map(([key, value]) => (
    <li><strong>{formatFieldName(key)}:</strong> {formatValue(key, value)}</li>
  ))
}
```

## 📝 Adding New Features

### Adding a New Part Type

1. **Define schema** (`libs/schema/parts/new-part.ts`):
   ```typescript
   export const newParts = sqliteTable('new_parts', {
     ...partColumns(manufacturers),
     // Custom fields
     custom_field: text('custom_field').notNull(),
   });
   ```

2. **Export from index** (`libs/schema/index.ts`):
   ```typescript
   export * from './parts/new-part';
   ```

3. **Generate & apply migration**:
   ```bash
   pnpm db:generate
   pnpm db:migrate:local
   ```

4. **Add seed data** (`libs/data/new-parts/example.json`):
   ```json
   {
     "id": 1,
     "manufacturer_id": 1,
     "name": "Example Part",
     "url": null,
     "release_date": null,
     "notes": "Description here",
     "custom_field": "value"
   }
   ```

5. **Seed database**:
   ```bash
   pnpm db:seed:local
   ```

6. **Create page** (`apps/web/src/pages/new-parts.astro`):
   ```astro
   ---
   import Layout from '../layouts/Layout.astro';
   import PartsList from '../components/PartsList.astro';
   ---

   <Layout title="New Parts">
     <PartsList
       tableName="newParts"
       title="New Parts"
       description="Description here"
     />
   </Layout>
   ```

Done! ✨

### Adding New Data

Just add a JSON file to the appropriate directory:

```bash
# Create new manufacturer
cat > libs/data/manufacturers/new-mfr.json << EOF
{
  "id": 3,
  "name": "New Manufacturer",
  "url": "https://example.com",
  "country": "US",
  "established": "2024"
}
EOF

# Reseed database
pnpm db:seed:local
```

The web app will automatically display the new data.

## 🗄️ Database Configuration

### Shared D1 Instance

Both web and bot apps share the **same Cloudflare D1 database**:

```toml
# wrangler.toml
[[d1_databases]]
binding = "DB"
database_name = "type-s-db"
database_id = "4f70f843-2817-4c0e-910a-5a1a02362bb8"
migrations_dir = "drizzle/migrations"
```

**Local development:**
- Single `.wrangler/` directory at root
- Migrations and seeds use root instance
- Web app dev server uses root instance
- No duplicate databases!

**Production:**
- Single D1 database in Cloudflare
- Both apps access same data
- Consistent data across all services

## 🔧 Configuration Files

### Root Level

- **`wrangler.toml`** - Cloudflare D1 config, migrations directory
- **`drizzle.config.ts`** - Points to schema files, output directory
- **`package.json`** - Workspace commands, shared dev dependencies

### Package Level

- **`libs/schema/package.json`** - Exports schema definitions
- **`libs/data/package.json`** - Seed generation scripts
- **`apps/web/package.json`** - Web app build/dev scripts
- **`apps/bot/package.json`** - Bot build/dev scripts

## 🎓 Key Concepts

### Base Columns Pattern

Shared columns are defined once and reused:

```typescript
// libs/schema/parts/part.ts
export function partColumns(manufacturersTable: any) {
  return {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    manufacturer_id: integer('manufacturer_id')
      .references(() => manufacturersTable.id)
      .notNull(),
    url: text('url'),
    release_date: integer('release_date', { mode: 'timestamp' }),
    notes: text('notes'),
  };
}

// Usage in specific tables
export const pcbs = sqliteTable('pcbs', {
  ...partColumns(manufacturers),  // Spreads base columns
  supports_bluetooth: integer('supports_bluetooth', { mode: 'boolean' }),
  layout: text('layout').notNull(),
});
```

### Drizzle ORM Configuration

```typescript
// apps/web/src/lib/db.ts
export function getDb(d1: D1Database) {
  return drizzle(d1, {
    schema,                  // Pass entire schema for relations
    casing: 'snake_case'     // Convert camelCase ↔ snake_case
  });
}
```

### Seed Generation

JSON → SQL conversion ensures type safety:

```typescript
// libs/data/generate-seed-sql.ts
function generateInsert(tableName: string, data: any[]): string[] {
  const statements: string[] = [];

  for (const row of data) {
    const columns = Object.keys(row);
    const values = columns.map((col) => escapeSQL(row[col]));

    statements.push(
      `INSERT INTO ${tableName} (${columns.join(", ")})
       VALUES (${values.join(", ")});`
    );
  }

  return statements;
}
```

## 🚨 Common Issues & Solutions

### Issue: "No such table" error

**Cause:** Migrations not applied or using wrong D1 instance

**Solution:**
```bash
# Check for .wrangler directories
find . -name ".wrangler" -type d

# Should only be one at root level
# If multiple exist, remove them and re-run:
rm -rf apps/*/.wrangler
pnpm db:migrate:local
pnpm db:seed:local
```

### Issue: Seed data has columns that don't exist

**Cause:** JSON data includes fields not in schema

**Solution:** Match JSON to schema exactly:
```json
{
  "id": 1,
  "manufacturer_id": 1,
  "name": "Part Name",
  "url": null,
  "release_date": null,
  "notes": "Use notes field for descriptions",
  "schema_field_1": "value",
  "schema_field_2": "value"
}
```

### Issue: Page doesn't show new fields

**Cause:** Probably caching or build issue

**Solution:**
```bash
# Restart dev server
# Changes to schema/data are reflected automatically
# via PartsList component
```

## 📚 Tech Stack

- **Framework:** [Astro](https://astro.build) - SSR web framework
- **Database:** [Cloudflare D1](https://developers.cloudflare.com/d1/) - SQLite at the edge
- **ORM:** [Drizzle](https://orm.drizzle.team) - TypeScript ORM
- **Hosting:** [Cloudflare Pages](https://pages.cloudflare.com) - Edge deployment
- **Monorepo:** [pnpm workspaces](https://pnpm.io/workspaces) - Fast, efficient package manager
- **Language:** TypeScript - Type safety throughout

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-part-type`)
3. Define schema in `libs/schema`
4. Add seed data in `libs/data`
5. Generate migrations (`pnpm db:generate`)
6. Test locally (`pnpm db:migrate:local && pnpm db:seed:local`)
7. Commit changes (`git commit -am 'Add new part type'`)
8. Push to branch (`git push origin feature/new-part-type`)
9. Create Pull Request

## 📄 License

[Your License Here]

## 🙏 Acknowledgments

Built for the HHKB community. Special thanks to PFU Limited and Topre Corporation for creating the legendary Happy Hacking Keyboard.

---

**Questions?** Open an issue or reach out to the maintainers.

**Want to add data?** Just drop a JSON file in `libs/data/` and submit a PR!
