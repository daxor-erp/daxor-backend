# Daxor Monorepo - GraphQL Backend

Complete GraphQL backend following stance_dashboard architecture.

## Architecture Match ✅

```
apps/api/src/
├── config/           ✅ Configuration management
├── dataloaders/      ✅ DataLoader pattern (ready)
├── lib/              ✅ Utilities (db-connection, etc)
├── middlewares/      ✅ Express & GraphQL middlewares
├── modules/          ✅ All business modules
│   ├── auth/
│   │   ├── schema.graphql
│   │   ├── resolvers.ts
│   │   ├── service.ts
│   │   ├── permissions.ts
│   │   └── index.ts
│   ├── user/
│   │   ├── schema.graphql
│   │   ├── resolvers.ts
│   │   ├── service.ts
│   │   ├── repository.ts
│   │   ├── model.ts
│   │   └── index.ts
│   ├── pdf/          ✅ PDF generation with Puppeteer
│   └── ... (all modules)
├── scripts/          ✅ Migration scripts
├── server/           ✅ GraphQL & Express setup
│   ├── transformer/  ✅ GraphQL transformers
│   ├── graphql.ts
│   └── express.ts
├── types/            ✅ TypeScript types
├── app.ts            ✅ Application bootstrap
├── constants.ts      ✅ Constants
└── index.ts          ✅ Entry point

packages/
├── db/               ✅ Database utilities
├── errors/           ✅ Error handling
├── observability/    ✅ Logging & metrics
├── typescript-config/✅ TS config
└── biome-config/     ✅ Linting config
```

## Setup

```bash
# Install dependencies
bun install

# Configure environment
cd apps/api
cp .env.example .env
# Edit .env with MongoDB URI

# Generate TypeScript types
bun run codegen

# Start development
cd ../..
bun run api:dev
```

## GraphQL Modules (All Complete)

✅ **Auth** - login, register, me, permissions
✅ **User** - Full CRUD with audit logs
✅ **Organization** - CRUD operations
✅ **Item** - Inventory management
✅ **Vendor** - Vendor management
✅ **Project** - Project management
✅ **Attendance** - Time tracking
✅ **Sales Order** - Sales operations
✅ **Purchase Order** - Purchase operations
✅ **Customer Invoice** - Invoicing
✅ **PDF** - PDF generation service
✅ **Audit Log** - Activity tracking
✅ **Counter** - Sequence generation

## Key Features

- ✅ GraphQL API with Apollo Server
- ✅ WebSocket subscriptions support
- ✅ GraphQL Shield permissions
- ✅ DataLoader pattern ready
- ✅ Error handling with custom errors
- ✅ JWT authentication
- ✅ MongoDB with Mongoose
- ✅ PDF generation with Puppeteer
- ✅ Audit logging
- ✅ Rate limiting
- ✅ CORS & Security headers
- ✅ TypeScript strict mode
- ✅ Biome linting & formatting
- ✅ Turbo monorepo

## API Endpoints

- GraphQL: `http://localhost:4000/graphql`
- Health: `http://localhost:4000/ping`

## No REST API ✅
All REST controllers and routes removed. Pure GraphQL architecture.
