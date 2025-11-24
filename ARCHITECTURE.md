# Type-S.org Architecture

## Overview

Multi-service architecture for managing keyboard parts database with community submissions via Discord.

## System Components

```
Discord Bot (CF Workers)
    ↓
Creates PR with JSON data
    ↓
GitHub Actions CI
    ├─ Validates against schema
    ├─ Runs checks
    └─ Requests review (or auto-merge for trusted roles)
    ↓
Merge to main
    ↓
GitHub Action
    ├─ Seeds data to Turso
    └─ Triggers Astro rebuild (Cloudflare Pages/Vercel)
    ↓
Live site updates
```

## Technology Stack

- **Database**: Turso (libSQL)
- **Website**: Astro + Astro DB
- **Bot**: Discord bot on Cloudflare Workers
- **CI/CD**: GitHub Actions
- **Hosting**: Cloudflare Pages / Vercel

---

## Phase 1: Schema Sharing

### Challenge
The Astro DB schema definitions need to be shared with the Discord bot for validation and type safety.

### Option A: Monorepo
```
type-s.org/
├── packages/
│   ├── schema/          # Shared schema definitions
│   ├── discord-bot/     # CF Worker
│   └── website/         # Astro site
├── package.json         # Workspace root
└── pnpm-workspace.yaml
```

**Pros:**
- Single source of truth
- Easy to keep in sync
- No publishing needed
- Import directly: `import { schema } from '@type-s/schema'`

**Cons:**
- More complex project structure
- Bigger repo

### Option B: Separate Package (Local)
```
type-s-schema/          # Separate repo
├── src/
│   └── index.ts        # Schema exports
└── package.json

type-s.org/             # Website repo
└── package.json        # Uses: "file:../type-s-schema"

type-s-bot/             # Bot repo
└── package.json        # Uses: "file:../type-s-schema"
```

**Pros:**
- Clear separation
- Can publish to npm later
- Each project independent

**Cons:**
- Need to manage 3 repos
- Local path dependencies in package.json
- Harder to keep in sync

### Option C: Drizzle ORM (Recommended)

Astro DB is built on top of Drizzle ORM. You can use Drizzle directly in both projects.

**How it works:**

1. **Define schema with Drizzle** (works with Astro DB)
```typescript
// db/schema/pcbs.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const pcbs = sqliteTable('pcbs', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  manufacturer_id: integer('manufacturer_id').references(() => manufacturers.id),
  // ... other columns
});
```

2. **Use in Astro** - Astro DB understands Drizzle schemas
```typescript
// astro.config.mjs
import db from '@astrojs/db';

export default defineConfig({
  integrations: [db()],
});
```

3. **Use in Discord Bot** - Direct Turso connection
```typescript
// discord-bot/src/db.ts
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { pcbs } from './schema/pcbs';

const client = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client);

// Query with full type safety
await db.insert(pcbs).values({ name: 'HHKB PCB', ... });
```

**Pros:**
- Single schema definition
- Works natively with Turso
- Full TypeScript types
- Both projects can query Turso directly
- Industry standard ORM

**Cons:**
- Need to convert existing Astro DB schemas to Drizzle
- Learning curve if unfamiliar with Drizzle

---

## Phase 2: Review Process

### Option A: GitHub PR Workflow (Best for quality control)

**Flow:**
1. Discord bot receives submission
2. Creates new branch
3. Adds JSON file to `data/submissions/[table]/[id].json`
4. Opens PR with form data
5. GitHub Actions validates against schema
6. Human reviews PR
7. Merge → triggers seed to Turso

**Pros:**
- Full audit trail
- Easy to review changes
- Can discuss in PR comments
- Rollback friendly

**Cons:**
- Slower (human review needed)
- More complex bot logic

### Option B: Auto-approve with Audit

**Flow:**
1. Check Discord user role
2. Trusted roles → auto-merge PR
3. Others → request review
4. All tracked in git

**Pros:**
- Fast for trusted users
- Still have review for unknowns
- Full history

**Cons:**
- Need role management
- Bot needs GitHub permissions

### Option C: Staging Table in Turso

**Flow:**
1. Bot writes to `pending_pcbs`, `pending_controllers`, etc.
2. Moderators review via Discord commands or web UI
3. Approval moves to production tables
4. Triggers site rebuild

**Pros:**
- Fast submissions
- Review happens in Discord
- No GitHub complexity

**Cons:**
- Need duplicate tables
- Less audit trail
- More complex approval system

---

## Phase 3: Site Updates

### Option A: Automatic Rebuild on Data Change

**Flow:**
1. GitHub Action detects Turso seed
2. Triggers Cloudflare Pages/Vercel deployment
3. 2-5 min rebuild time

**Pros:**
- Automatic
- Always up to date

**Cons:**
- Build time delay
- More CI minutes used

### Option B: Scheduled Rebuilds

**Flow:**
1. Cron job rebuilds every hour/day
2. Pulls latest from Turso

**Pros:**
- Predictable
- Simpler
- Lower CI costs

**Cons:**
- Delayed updates
- Might rebuild with no changes

### Option C: Hybrid SSR

**Flow:**
1. Data pages use Astro SSR
2. Reads from Turso on each request
3. Static pages for docs/guides

**Pros:**
- Instant updates
- No rebuilds needed
- Best user experience

**Cons:**
- Need server/edge runtime
- Slightly slower page loads
- Database connection overhead

---

## Recommended Approach

**Phase 1: Schema Sharing**
- ✅ Use Drizzle ORM for schema definitions
- ✅ Monorepo structure with shared schema package
- ✅ Both Astro and Discord bot import same schemas

**Phase 2: Review Process**
- ✅ GitHub PR workflow for submissions
- ✅ Auto-merge for trusted Discord roles
- ✅ Manual review for others

**Phase 3: Site Updates**
- ✅ Hybrid: SSR for data pages, static for docs
- ✅ Instant updates without rebuilds

---

## Next Steps

1. [ ] Convert Astro DB schemas to Drizzle
2. [ ] Set up monorepo structure
3. [ ] Create shared schema package
4. [ ] Build Discord bot with schema imports
5. [ ] Implement PR creation flow
6. [ ] Add GitHub Actions validation
7. [ ] Set up Turso connection
8. [ ] Configure Astro SSR for data pages

---

## Questions to Answer

- How often do you expect submissions?
- Should all submissions be reviewed or auto-approve trusted users?
- Prefer instant updates (SSR) or periodic rebuilds?
- Want to publish schema package to npm eventually?
